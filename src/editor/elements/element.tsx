import { memo, useCallback, useEffect, useMemo, useRef } from "react";
import { useEditorStore } from "../store";
import { iElement } from "../types";
import dynamic from "next/dynamic";

const CodeEditorElement = dynamic(() => import("./code-editor"), {
  ssr: false,
});
const TextElement = dynamic(() => import("./text-element"), { ssr: false });

export default function Element({ element }: { element: iElement }) {
  const updateElementTransform = useEditorStore(
    (state) => state.updateElementTransform,
  );

  const elementRef = useRef<HTMLDivElement>(null);

  const updateElementState = useEditorStore(
    (state) => state.updateElementState,
  );
  const setSelectedElement = useEditorStore(
    (state) => state.setSelectedElement,
  );

  const offset = useMemo(() => {
    if (!element.transform) {
      return {
        x: 0,
        y: 0,
      };
    }
    return {
      x:
        (element.transform.width * element.transform.scale -
          element.transform.width) /
        2,
      y:
        (element.transform.height * element.transform.scale -
          element.transform.height) /
        2,
    };
  }, [element.transform]);

  const handleMouseEnter = useCallback(() => {
    if (element.hidden || element.locked) {
      return;
    }
    updateElementState(element.id, { hovering: true });
  }, [element.hidden, element.locked, element.id, updateElementState]);

  const handleMouseLeave = useCallback(() => {
    if (element.hidden || element.locked) {
      return;
    }
    updateElementState(element.id, { hovering: false });
  }, [element.hidden, element.locked, element.id, updateElementState]);

  const handleMouseDown = useCallback(() => {
    if (element.hidden || element.locked) {
      return;
    }
    setSelectedElement(element.id);
  }, [element.hidden, element.locked, element.id, setSelectedElement]);

  useEffect(() => {
    if (!elementRef.current) {
      return;
    }

    const el = elementRef.current;
    const resizeObserver = new ResizeObserver((entries) => {
      const width = entries[0].contentRect.width;
      const height = entries[0].contentRect.height;
      console.log({ width, height });
      updateElementTransform(element.id, {
        ...(element.transform.autoWidth && element.transform.width !== width
          ? { width }
          : {}),
        ...(element.transform.autoHeight && element.transform.height !== height
          ? { height }
          : {}),
      });
    });

    resizeObserver.observe(el);

    return () => {
      resizeObserver.unobserve(el);
    };
  }, [
    element.id,
    element.transform.autoHeight,
    element.transform.autoWidth,
    element.transform.height,
    element.transform.width,
    updateElementTransform,
  ]);

  if (!element) {
    return null;
  }

  return (
    <div
      ref={elementRef}
      style={{
        display: element.hidden ? "none" : undefined,
        pointerEvents: element.locked ? "none" : "auto",
        left: element.transform.position.x,
        top: element.transform.position.y,
        width: element.transform.autoWidth
          ? "fit-content"
          : element.transform.width,
        height: element.transform.autoHeight
          ? "fit-content"
          : element.transform.height,
        transform: `
          translate(${offset.x}px, ${offset.y}px) 
          rotate(${element.transform.rotation}deg) 
          scale(${element.transform.scale})
        `,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      className="absolute"
    >
      {element.type === "code-editor" ? (
        <CodeEditorElement element={element} />
      ) : element.type === "text" ? (
        <TextElement element={element} />
      ) : null}
    </div>
  );
}

export const ElementMemo = memo(Element);

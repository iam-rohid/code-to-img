import { memo, useCallback, useEffect, useMemo, useRef } from "react";
import { useEditorStore } from "../store";
import { iElement, iElementTransform } from "../types";
import CodeEditorElement from "./code-editor";
import TextElement from "./text-element";

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
    const el = elementRef.current;
    if (!el) {
      return;
    }

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        const width = entry.contentRect.width;
        const height = entry.contentRect.height;

        const data: Partial<iElementTransform> = {};
        if (element.transform.autoWidth) {
          data.width = width;
        }
        if (element.transform.autoHeight) {
          data.height = height;
        }
        if (
          typeof data.width === "undefined" &&
          typeof data.height === "undefined"
        ) {
          return;
        }
        updateElementTransform(element.id, data);
      }
    });

    resizeObserver.observe(el);

    return () => {
      resizeObserver.unobserve(el);
    };
  }, [
    element.id,
    element.transform.autoHeight,
    element.transform.autoWidth,
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
        minWidth: element.transform.minWidth,
        minHeight: element.transform.minHeight,
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

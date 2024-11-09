import { memo, MouseEvent, useCallback, useMemo, useRef } from "react";
import { useEditorStore } from "../store";
import CodeEditorElement from "./code-editor";
import TextElement from "./text-element";
import { iElement } from "../types";

export default function Element({ element }: { element: iElement }) {
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

  const handleMouseEnter = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (element.hidden || element.locked) {
        return;
      }

      e.preventDefault();
      updateElementState(element.id, { hovering: true });
    },
    [element.hidden, element.locked, element.id, updateElementState],
  );

  const handleMouseLeave = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (element.hidden || element.locked) {
        return;
      }
      e.preventDefault();
      updateElementState(element.id, { hovering: false });
    },
    [element.hidden, element.locked, element.id, updateElementState],
  );

  const handleMouseDown = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (element.hidden || element.locked) {
        return;
      }
      e.preventDefault();
      setSelectedElement(element.id);
    },
    [element.hidden, element.locked, element.id, setSelectedElement],
  );

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
        width: element.transform.width,
        height: element.transform.height,
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

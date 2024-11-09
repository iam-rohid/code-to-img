import { MouseEvent, useCallback, useMemo, useRef } from "react";
import { useEditorStore } from "../store";
import CodeEditorElement from "./code-editor";
import TextElement from "./text-element";

export default function Element({ elementId }: { elementId: string }) {
  const element = useEditorStore((state) =>
    state.canvas.elements.find((element) => element.id === elementId),
  );
  const elementRef = useRef<HTMLDivElement>(null);

  const updateElementState = useEditorStore(
    (state) => state.updateElementState,
  );
  const setSelectedElement = useEditorStore(
    (state) => state.setSelectedElement,
  );

  const offset = useMemo(() => {
    if (!element?.transform) {
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
  }, [element?.transform]);

  const handleMouseEnter = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (element?.hidden || element?.locked) {
        return;
      }

      e.preventDefault();
      updateElementState(elementId, { hovering: true });
    },
    [element?.hidden, element?.locked, elementId, updateElementState],
  );

  const handleMouseLeave = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (element?.hidden || element?.locked) {
        return;
      }
      e.preventDefault();
      updateElementState(elementId, { hovering: false });
    },
    [element?.hidden, element?.locked, elementId, updateElementState],
  );

  const handleMouseDown = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (element?.hidden || element?.locked) {
        return;
      }
      e.preventDefault();
      setSelectedElement(elementId);
    },
    [element?.hidden, element?.locked, elementId, setSelectedElement],
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
        <CodeEditorElement elementId={elementId} />
      ) : element.type === "text" ? (
        <TextElement elementId={elementId} />
      ) : null}
    </div>
  );
}

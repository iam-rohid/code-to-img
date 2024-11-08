import { MouseEvent, useCallback, useMemo } from "react";
import { useEditorStore } from "../store";
import CodeEditorElement from "./code-editor";

export default function Element({ elementId }: { elementId: string }) {
  const element = useEditorStore((state) =>
    state.canvas.elements.find((element) => element.id === elementId),
  );

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
      e.preventDefault();
      updateElementState(elementId, { hovering: true });
    },
    [elementId, updateElementState],
  );

  const handleMouseLeave = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      updateElementState(elementId, { hovering: false });
    },
    [elementId, updateElementState],
  );

  const handleMouseDown = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      setSelectedElement(elementId);
    },
    [elementId, setSelectedElement],
  );

  if (!element) {
    return null;
  }

  return (
    <div
      style={{
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
      ) : null}
    </div>
  );
}

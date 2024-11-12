import React, {
  MouseEvent,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";

import { cn } from "@/lib/utils";
import { iElement } from "@/lib/validator/element";
import { useSnippetStore } from "@/providers/snippet-provider";
import { useEditorStore } from "@/store/editor-store";

export default function Draggable({
  element,
  children,
  className,
}: {
  element: iElement;
  children: ReactNode;
  className?: string;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const updateElementTransform = useSnippetStore(
    (state) => state.updateElementTransform,
  );
  const updateElementState = useEditorStore(
    (state) => state.updateElementState,
  );
  const zoom = useEditorStore((state) => state.zoom);

  const [startMousePos, setStartMousePos] = useState({ x: 0, y: 0 });

  const handleMouseDown = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (element.locked || element.hidden) {
        return;
      }

      setIsDragging(true);
      updateElementState(element.id, { dragging: true });
      setStartMousePos({ x: e.clientX, y: e.clientY });
      document.documentElement.classList.add("cursor-move", "select-none");
    },
    [element.hidden, element.id, element.locked, updateElementState],
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    updateElementState(element.id, { dragging: false });
    document.documentElement.classList.remove("cursor-move", "select-none");
  }, [element.id, updateElementState]);

  const handleMouseMove = useCallback(
    (e: globalThis.MouseEvent) => {
      let x = element.transform.position.x;
      let y = element.transform.position.y;

      const difX = startMousePos.x - e.clientX;
      const difY = startMousePos.y - e.clientY;

      x -= difX / zoom;
      y -= difY / zoom;

      setStartMousePos({ x: e.clientX, y: e.clientY });

      updateElementTransform(element.id, {
        position: { x: Math.round(x), y: Math.round(y) },
      });
    },
    [
      element.id,
      element.transform.position.x,
      element.transform.position.y,
      startMousePos.x,
      startMousePos.y,
      updateElementTransform,
      zoom,
    ],
  );

  useEffect(() => {
    if (!isDragging) return;

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp, isDragging]);

  return (
    <div
      className={cn(className, {
        "cursor-move": !element.locked && !element.hidden,
      })}
      onMouseDown={handleMouseDown}
    >
      {children}
    </div>
  );
}

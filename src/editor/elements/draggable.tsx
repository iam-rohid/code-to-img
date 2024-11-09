import React, {
  MouseEvent,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";
import { iElement } from "../types";
import { cn } from "@/lib/utils";
import { useEditorStore } from "../store";

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
  const updateElement = useEditorStore((state) => state.updateElement);
  const [startMousePos, setStartMousePos] = useState({ x: 0, y: 0 });

  const handleMouseDown = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (element.locked || element.hidden) {
        return;
      }

      e.preventDefault();
      setIsDragging(true);
      setStartMousePos({ x: e.clientX, y: e.clientY });
      document.documentElement.classList.add("cursor-move", "select-none");
    },
    [element.hidden, element.locked],
  );

  const handleMouseUp = useCallback((e: globalThis.MouseEvent) => {
    e.preventDefault();
    setIsDragging(false);
    document.documentElement.classList.remove("cursor-move", "select-none");
  }, []);

  const handleMouseMove = useCallback(
    (e: globalThis.MouseEvent) => {
      e.preventDefault();

      let x = element.transform.position.x;
      let y = element.transform.position.y;

      const difX = startMousePos.x - e.clientX;
      const difY = startMousePos.y - e.clientY;

      x -= difX;
      y -= difY;

      setStartMousePos({ x: e.clientX, y: e.clientY });

      updateElement({
        ...element,
        transform: {
          ...element.transform,
          position: { x, y },
        },
      });
    },
    [element, startMousePos.x, startMousePos.y, updateElement],
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

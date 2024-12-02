import { MouseEvent, useCallback, useEffect, useRef, useState } from "react";

export function useDragElement({
  onDragStart,
  x,
  y,
  onDragEnd,
  zoom,
  onDrag,
  readOnly,
  onDoubleClick,
}: {
  x: number;
  y: number;
  zoom: number;
  readOnly?: boolean;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  onDrag?: (pos: { x: number; y: number }) => void;
  onDoubleClick?: () => void;
}) {
  const [checkForDragging, setCheckForDragging] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const startMousePos = useRef({ x: 0, y: 0 });
  const startElementPos = useRef({ x, y });
  const clickCount = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const onMouseDown = useCallback(
    (e: MouseEvent) => {
      if (readOnly) {
        return;
      }

      startMousePos.current = { x: e.clientX, y: e.clientY };
      startElementPos.current = { x, y };
      setCheckForDragging(true);
      document.documentElement.classList.add("cursor-move", "select-none");
      clickCount.current++;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        clickCount.current = 0;
        timeoutRef.current = null;
      }, 500);
    },
    [readOnly, x, y],
  );

  const handleMouseUp = useCallback(() => {
    setCheckForDragging(false);
    document.documentElement.classList.remove("cursor-move", "select-none");

    if (isDragging) {
      setIsDragging(false);
      onDragEnd?.();
    }

    if (clickCount.current >= 2) {
      clickCount.current = 0;
      onDoubleClick?.();
    }
  }, [isDragging, onDoubleClick, onDragEnd]);

  const handleMouseMove = useCallback(
    (e: globalThis.MouseEvent) => {
      let x = startElementPos.current.x;
      let y = startElementPos.current.y;

      const difX = startMousePos.current.x - e.clientX;
      const difY = startMousePos.current.y - e.clientY;

      if (!isDragging) {
        if (checkForDragging) {
          const distance = Math.sqrt(difX * difX + difY * difY);
          if (distance > 5) {
            setIsDragging(true);
            onDragStart?.();
            clickCount.current = 0;
          }
        }
        return;
      }

      x -= difX / zoom;
      y -= difY / zoom;

      const newPos = { x: Math.round(x), y: Math.round(y) };
      onDrag?.(newPos);
      startElementPos.current = newPos;
      startMousePos.current = { x: e.clientX, y: e.clientY };
    },
    [checkForDragging, isDragging, onDrag, onDragStart, zoom],
  );

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  return { onMouseDown, isDragging };
}

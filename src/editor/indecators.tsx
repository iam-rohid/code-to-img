import {
  CSSProperties,
  MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { iElement, iElementTransform } from "./types";
import { useEditorStore } from "./store";
import { cn } from "@/lib/utils";

function getTransform(element: iElementTransform): CSSProperties {
  const width = element.width * element.scale;
  const height = element.height * element.scale;

  return {
    width,
    height,

    left: element.position.x,
    top: element.position.y,

    transform: `rotate(${element.rotation}deg)`,
  };
}

export function Indecators() {
  const elementState = useEditorStore((state) => state.elementState);
  const selectedElementId = useEditorStore((state) => state.selectedElementId);
  const selectedElement = useEditorStore((state) =>
    selectedElementId
      ? (state.canvas.elements.find(
          (element) => element.id === selectedElementId,
        ) ?? null)
      : null,
  );

  return (
    <>
      {Object.entries(elementState).map(([elementId, state]) => {
        if (state.hovering && !(elementId === selectedElementId)) {
          return <HovernigIndecator key={elementId} elementId={elementId} />;
        }
        return null;
      })}
      {selectedElementId === "canvas" ? (
        <CanvasTransformIndecator />
      ) : selectedElement &&
        !selectedElement.hidden &&
        !selectedElement.locked ? (
        <ElementTransformIndecator element={selectedElement} />
      ) : null}
    </>
  );
}

function CanvasTransformIndecator() {
  const canvasWidth = useEditorStore((state) => state.canvas.width);
  const canvasHeight = useEditorStore((state) => state.canvas.height);
  const canvasWidthHeightLinked = useEditorStore(
    (state) => state.canvas.widthHeightLinked,
  );
  const setCanvas = useEditorStore((state) => state.setCanvas);
  const canvasMinWidth = 200;
  const canvasMinHeight = 200;

  const [startMousePos, setStartMousePos] = useState({ x: 0, y: 0 });

  const handleResize = useCallback(
    (
      pos: { x: number; y: number },
      position: "top-left" | "top-right" | "bottom-left" | "bottom-right",
    ) => {
      let width = canvasWidth;
      let height = canvasHeight;

      const difX = (startMousePos.x - pos.x) * 2;
      const difY = (startMousePos.y - pos.y) * 2;

      switch (position) {
        case "top-left":
          width += difX;
          height += difY;
          break;
        case "top-right":
          width -= difX;
          height += difY;
          break;
        case "bottom-left":
          width += difX;
          height -= difY;
          break;
        case "bottom-right":
          width -= difX;
          height -= difY;
          break;

        default:
          break;
      }

      const newStartPos = pos;

      if (width < canvasMinWidth) {
        width = canvasMinWidth;
        newStartPos.x = startMousePos.x;
      }

      if (height < canvasMinHeight) {
        height = canvasMinHeight;
        newStartPos.y = startMousePos.y;
      }

      setCanvas({
        width,
        height,
      });
      setStartMousePos(newStartPos);
    },
    [canvasWidth, canvasHeight, startMousePos.x, startMousePos.y, setCanvas],
  );

  const handleResize2 = useCallback(
    (
      pos: { x: number; y: number },
      position: "left" | "right" | "top" | "bottom",
    ) => {
      let width = canvasWidth;
      let height = canvasHeight;

      const difX = (startMousePos.x - pos.x) * 2;
      const difY = (startMousePos.y - pos.y) * 2;

      switch (position) {
        case "left":
          width += difX;
          break;
        case "right":
          width -= difX;
          break;
        case "top":
          height += difY;
          break;
        case "bottom":
          height -= difY;
          break;

        default:
          break;
      }

      const newStartPos = pos;

      if (width < canvasMinWidth) {
        width = canvasMinWidth;
        newStartPos.x = startMousePos.x;
      }
      if (height < canvasMinHeight) {
        height = canvasMinHeight;
        newStartPos.y = startMousePos.y;
      }

      if (canvasWidthHeightLinked) {
        switch (position) {
          case "top":
          case "bottom": {
            width = (width * height) / canvasHeight;
            if (width < canvasMinWidth) {
              width = canvasMinWidth;
              height = (width * canvasHeight) / canvasWidth;
              newStartPos.x = startMousePos.x;
              newStartPos.y = startMousePos.y;
            }
            break;
          }
          case "left":
          case "right":
            {
              height = (width * height) / canvasWidth;
              if (height < canvasMinHeight) {
                height = canvasMinHeight;
                width = (height * canvasWidth) / canvasHeight;
                newStartPos.x = startMousePos.x;
                newStartPos.y = startMousePos.y;
              }
            }
            break;

          default:
            break;
        }
      }

      setCanvas({ width, height });
      setStartMousePos(newStartPos);
    },
    [
      canvasWidth,
      canvasHeight,
      startMousePos.x,
      startMousePos.y,
      canvasWidthHeightLinked,
      setCanvas,
    ],
  );

  return (
    <div
      style={getTransform({
        height: canvasHeight,
        width: canvasWidth,
        minHeight: 0,
        minWidth: 0,
        position: { x: 0, y: 0 },
        rotation: 0,
        scale: 1,
        widthHeightLinked: false,
      })}
      className="pointer-events-none absolute z-20"
    >
      <BarIndecator
        position="top"
        onResizeStart={(x, y) => setStartMousePos({ x, y })}
        onResize={(x, y) => handleResize2({ x, y }, "top")}
      />
      <BarIndecator
        position="right"
        onResizeStart={(x, y) => setStartMousePos({ x, y })}
        onResize={(x, y) => handleResize2({ x, y }, "right")}
      />
      <BarIndecator
        position="bottom"
        onResizeStart={(x, y) => setStartMousePos({ x, y })}
        onResize={(x, y) => handleResize2({ x, y }, "bottom")}
      />
      <BarIndecator
        position="left"
        onResizeStart={(x, y) => setStartMousePos({ x, y })}
        onResize={(x, y) => handleResize2({ x, y }, "left")}
      />

      <ScaleIndecator
        position="top-left"
        onResizeStart={(x, y) => setStartMousePos({ x, y })}
        onResize={(x, y) => handleResize({ x, y }, "top-left")}
      />
      <ScaleIndecator
        position="top-right"
        onResizeStart={(x, y) => setStartMousePos({ x, y })}
        onResize={(x, y) => handleResize({ x, y }, "top-right")}
      />

      <ScaleIndecator
        position="bottom-left"
        onResizeStart={(x, y) => setStartMousePos({ x, y })}
        onResize={(x, y) => handleResize({ x, y }, "bottom-left")}
      />
      <ScaleIndecator
        position="bottom-right"
        onResizeStart={(x, y) => setStartMousePos({ x, y })}
        onResize={(x, y) => handleResize({ x, y }, "bottom-right")}
      />
    </div>
  );
}

function ElementTransformIndecator({ element }: { element: iElement }) {
  const [startMousePos, setStartMousePos] = useState({ x: 0, y: 0 });
  const updateElement = useEditorStore((state) => state.updateElement);
  const elementRef = useRef<HTMLDivElement>(null);

  const handleResize = useCallback(
    (
      pos: { x: number; y: number },
      position: "top-left" | "top-right" | "bottom-left" | "bottom-right",
    ) => {
      const elementWidth = element.transform.width * element.transform.scale;
      const elementHeight = element.transform.height * element.transform.scale;
      const elementMinWidth =
        element.transform.minWidth * element.transform.scale;
      const elementMinHeight =
        element.transform.minHeight * element.transform.scale;

      let width = elementWidth;
      let height = elementHeight;

      let x = element.transform.position.x;
      let y = element.transform.position.y;

      const difX = startMousePos.x - pos.x;
      const difY = startMousePos.y - pos.y;

      switch (position) {
        case "top-left":
          width += difX;
          height += difY;
          x -= difX;
          y -= difY;
          break;
        case "top-right":
          width -= difX;
          height += difY;
          y -= difY;
          break;
        case "bottom-left":
          width += difX;
          height -= difY;
          x -= difX;
          break;
        case "bottom-right":
          width -= difX;
          height -= difY;
          break;

        default:
          break;
      }

      const newStartPos = pos;

      if (width < elementMinWidth) {
        let dif = elementWidth - elementMinWidth;
        if (position === "top-right" || position === "bottom-right") {
          dif = 0;
        }
        width = elementMinWidth;
        x = element.transform.position.x + dif;
        newStartPos.x = startMousePos.x;
      }

      if (height < elementMinHeight) {
        let dif = elementHeight - elementMinHeight;
        if (position === "bottom-left" || position === "bottom-right") {
          dif = 0;
        }
        height = elementMinHeight;
        y = element.transform.position.y + dif;
        newStartPos.y = startMousePos.y;
      }

      updateElement({
        ...element,
        transform: {
          ...element.transform,
          width: width / element.transform.scale,
          height: height / element.transform.scale,
          position: { x, y },
        },
      });
      setStartMousePos(newStartPos);
    },
    [element, startMousePos.x, startMousePos.y, updateElement],
  );

  const handleResize2 = useCallback(
    (
      pos: { x: number; y: number },
      position: "left" | "right" | "top" | "bottom",
    ) => {
      const elementWidth = element.transform.width * element.transform.scale;
      const elementHeight = element.transform.height * element.transform.scale;
      const elementMinWidth =
        element.transform.minWidth * element.transform.scale;
      const elementMinHeight =
        element.transform.minHeight * element.transform.scale;

      let width = elementWidth;
      let height = elementHeight;
      let x = element.transform.position.x;
      let y = element.transform.position.y;

      const difX = startMousePos.x - pos.x;
      const difY = startMousePos.y - pos.y;

      switch (position) {
        case "left":
          width += difX;
          x -= difX;
          break;
        case "right":
          width -= difX;
          break;
        case "top":
          height += difY;
          y -= difY;
          break;
        case "bottom":
          height -= difY;
          break;

        default:
          break;
      }

      const newStartPos = pos;

      if (width < elementMinWidth) {
        const dif = elementWidth - elementMinWidth;
        width = elementMinWidth;
        x = element.transform.position.x + dif * (position === "left" ? 1 : 0);
        newStartPos.x = startMousePos.x;
      }
      if (height < elementMinHeight) {
        const dif = elementHeight - elementMinHeight;
        height = elementMinHeight;
        y = element.transform.position.y + dif * (position === "top" ? 1 : 0);
        newStartPos.y = startMousePos.y;
      }

      updateElement({
        ...element,
        transform: {
          ...element.transform,
          width: width / element.transform.scale,
          height: height / element.transform.scale,
          position: { x, y },
        },
      });
      setStartMousePos(newStartPos);
    },
    [element, startMousePos.x, startMousePos.y, updateElement],
  );

  const [isRotating, setIsRotating] = useState(false);

  const handleMouseDown = useCallback((e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsRotating(true);
    document.documentElement.classList.add("cursor-grabbing", "select-none");
  }, []);

  const handleMouseUp = useCallback((e: globalThis.MouseEvent) => {
    e.preventDefault();
    setIsRotating(false);
    document.documentElement.classList.remove("cursor-grabbing", "select-none");
  }, []);

  const handleMouseMove = useCallback(
    (e: globalThis.MouseEvent) => {
      if (!elementRef.current) {
        return;
      }

      const box = elementRef.current.getBoundingClientRect();
      const elementX = box.x + box.width / 2;
      const elementY = box.y + box.height / 2;

      const mouseX = e.clientX;
      const mouseY = e.clientY;

      const dx = mouseX - elementX;
      const dy = mouseY - elementY;

      // Calculate the angle in radians
      const angleInRadians = Math.atan2(dy, dx);

      // Convert the angle to degrees if needed
      const angleInDegrees = angleInRadians * (180 / Math.PI);
      updateElement({
        ...element,
        transform: {
          ...element.transform,
          rotation: angleInDegrees + 90,
        },
      });
    },
    [element, updateElement],
  );

  useEffect(() => {
    if (!isRotating) return;

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp, isRotating]);

  return (
    <div
      ref={elementRef}
      style={getTransform(element.transform)}
      className="pointer-events-none absolute z-20"
    >
      <BarIndecator
        position="top"
        onResizeStart={(x, y) => setStartMousePos({ x, y })}
        onResize={(x, y) => handleResize2({ x, y }, "top")}
      />
      <BarIndecator
        position="right"
        onResizeStart={(x, y) => setStartMousePos({ x, y })}
        onResize={(x, y) => handleResize2({ x, y }, "right")}
      />
      <BarIndecator
        position="bottom"
        onResizeStart={(x, y) => setStartMousePos({ x, y })}
        onResize={(x, y) => handleResize2({ x, y }, "bottom")}
      />
      <BarIndecator
        position="left"
        onResizeStart={(x, y) => setStartMousePos({ x, y })}
        onResize={(x, y) => handleResize2({ x, y }, "left")}
      />

      <ScaleIndecator
        position="top-left"
        onResizeStart={(x, y) => setStartMousePos({ x, y })}
        onResize={(x, y) => handleResize({ x, y }, "top-left")}
      />
      <ScaleIndecator
        position="top-right"
        onResizeStart={(x, y) => setStartMousePos({ x, y })}
        onResize={(x, y) => handleResize({ x, y }, "top-right")}
      />

      <ScaleIndecator
        position="bottom-left"
        onResizeStart={(x, y) => setStartMousePos({ x, y })}
        onResize={(x, y) => handleResize({ x, y }, "bottom-left")}
      />
      <ScaleIndecator
        position="bottom-right"
        onResizeStart={(x, y) => setStartMousePos({ x, y })}
        onResize={(x, y) => handleResize({ x, y }, "bottom-right")}
      />

      <div
        className={cn(
          "pointer-events-auto absolute -top-6 left-1/2 h-4 w-4 -translate-x-1/2 cursor-grab rounded-full border-2 border-blue-500 bg-background",
          {
            "cursor-grabbing": isRotating,
          },
        )}
        onMouseDown={handleMouseDown}
      ></div>
    </div>
  );
}

function ScaleIndecator({
  position,
  onResize,
  onResizeEnd,
  onResizeStart,
}: {
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  onResizeStart?: (mouseX: number, mouseY: number) => void;
  onResize?: (mouseX: number, mouseY: number) => void;
  onResizeEnd?: (mouseX: number, mouseY: number) => void;
}) {
  const [isResizing, setIsResizing] = useState(false);
  const cursorClass = useMemo(() => {
    if (position === "top-left" || position === "bottom-right") {
      return "cursor-nwse-resize";
    } else {
      return "cursor-nesw-resize";
    }
  }, [position]);

  const handleMouseDown = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsResizing(true);
      onResizeStart?.(e.clientX, e.clientY);
      document.documentElement.classList.add(cursorClass, "select-none");
    },
    [onResizeStart, cursorClass],
  );

  const handleMouseUp = useCallback(
    (e: globalThis.MouseEvent) => {
      e.preventDefault();
      setIsResizing(false);
      onResizeEnd?.(e.clientX, e.clientY);
      document.documentElement.classList.remove(cursorClass, "select-none");
    },
    [cursorClass, onResizeEnd],
  );

  const handleMouseMove = useCallback(
    (e: globalThis.MouseEvent) => {
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      onResize?.(mouseX, mouseY);
    },
    [onResize],
  );

  useEffect(() => {
    if (!isResizing) return;

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp, isResizing]);

  return (
    <div
      onMouseDown={handleMouseDown}
      className={cn(
        "pointer-events-auto absolute z-20 h-3 w-3 rounded-full border-2 border-blue-500 bg-background",
        {
          "-left-1.5 -top-1.5": position === "top-left",
          "-right-1.5 -top-1.5": position === "top-right",
          "-bottom-1.5 -left-1.5": position === "bottom-left",
          "-bottom-1.5 -right-1.5": position === "bottom-right",
        },
        cursorClass,
      )}
    ></div>
  );
}

function BarIndecator({
  position,
  onResize,
  onResizeEnd,
  onResizeStart,
}: {
  position: "left" | "right" | "top" | "bottom";
  onResizeStart?: (mouseX: number, mouseY: number) => void;
  onResize?: (mouseX: number, mouseY: number) => void;
  onResizeEnd?: (mouseX: number, mouseY: number) => void;
}) {
  const [isResizing, setIsResizing] = useState(false);

  const cursorClass = useMemo(() => {
    if (position === "top" || position === "bottom") {
      return "cursor-ns-resize";
    } else {
      return "cursor-ew-resize";
    }
  }, [position]);

  const handleMouseDown = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsResizing(true);
      onResizeStart?.(e.clientX, e.clientY);
      document.documentElement.classList.add(cursorClass, "select-none");
    },
    [cursorClass, onResizeStart],
  );

  const handleMouseUp = useCallback(
    (e: globalThis.MouseEvent) => {
      e.preventDefault();
      setIsResizing(false);
      onResizeEnd?.(e.clientX, e.clientY);
      document.documentElement.classList.remove(cursorClass, "select-none");
    },
    [cursorClass, onResizeEnd],
  );

  const handleMouseMove = useCallback(
    (e: globalThis.MouseEvent) => {
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      onResize?.(mouseX, mouseY);
    },
    [onResize],
  );

  useEffect(() => {
    if (!isResizing) return;

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp, isResizing]);

  return (
    <div
      onMouseDown={handleMouseDown}
      className={cn("z pointer-events-auto absolute z-10", cursorClass, {
        "-top-1 left-0 right-0 h-2": position === "top",
        "-bottom-1 left-0 right-0 h-2": position === "bottom",
        "-right-1 bottom-0 top-0 w-2": position === "right",
        "-left-1 bottom-0 top-0 w-2": position === "left",
      })}
    >
      <div
        className={cn("absolute bg-blue-500", {
          "left-0 right-0 top-1/2 h-0.5 -translate-y-1/2":
            position === "top" || position === "bottom",
          "bottom-0 left-1/2 top-0 w-0.5 -translate-x-1/2":
            position === "left" || position === "right",
        })}
      ></div>
    </div>
  );
}

function HovernigIndecator({ elementId }: { elementId: string }) {
  const transform = useEditorStore(
    (state) =>
      state.canvas.elements.find((element) => element.id === elementId)
        ?.transform,
  );

  if (!transform) {
    return null;
  }

  return (
    <div
      style={getTransform(transform)}
      className="pointer-events-none absolute z-20 ring-2 ring-blue-500"
    ></div>
  );
}

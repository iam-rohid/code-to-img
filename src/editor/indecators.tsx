import {
  CSSProperties,
  memo,
  MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { iElementTransform } from "./types";
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

  const elementStates = useMemo(
    () => Object.entries(elementState),
    [elementState],
  );

  return (
    <>
      {elementStates.map(([elementId, state]) => {
        if (state.resizing) {
          return <ResizeIndecator elementId={elementId} key={elementId} />;
        }
        if (state.dragging) {
          return <DraggingIndecator elementId={elementId} key={elementId} />;
        }
        if (state.rotating) {
          return <RotatingIndecator elementId={elementId} key={elementId} />;
        }
        if (state.hovering && !(elementId === selectedElementId)) {
          return (
            <HovernigIndecatorMemo key={elementId} elementId={elementId} />
          );
        }
        return null;
      })}
      {selectedElementId === "canvas" ? (
        <CanvasTransformIndecatorMemo />
      ) : selectedElement &&
        !selectedElement.hidden &&
        !selectedElement.locked ? (
        <ElementTransformIndecatorMemo
          elementId={selectedElement.id}
          transform={selectedElement.transform}
        />
      ) : null}
    </>
  );
}

export const IndecatorsMemo = memo(Indecators);

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

  const handleCornerResize = useCallback(
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

  const handleSideResize = useCallback(
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
        onResize={(x, y) => handleSideResize({ x, y }, "top")}
      />
      <BarIndecator
        position="right"
        onResizeStart={(x, y) => setStartMousePos({ x, y })}
        onResize={(x, y) => handleSideResize({ x, y }, "right")}
      />
      <BarIndecator
        position="bottom"
        onResizeStart={(x, y) => setStartMousePos({ x, y })}
        onResize={(x, y) => handleSideResize({ x, y }, "bottom")}
      />
      <BarIndecator
        position="left"
        onResizeStart={(x, y) => setStartMousePos({ x, y })}
        onResize={(x, y) => handleSideResize({ x, y }, "left")}
      />

      <ScaleIndecator
        position="top-left"
        onResizeStart={(x, y) => setStartMousePos({ x, y })}
        onResize={(x, y) => handleCornerResize({ x, y }, "top-left")}
      />
      <ScaleIndecator
        position="top-right"
        onResizeStart={(x, y) => setStartMousePos({ x, y })}
        onResize={(x, y) => handleCornerResize({ x, y }, "top-right")}
      />

      <ScaleIndecator
        position="bottom-left"
        onResizeStart={(x, y) => setStartMousePos({ x, y })}
        onResize={(x, y) => handleCornerResize({ x, y }, "bottom-left")}
      />
      <ScaleIndecator
        position="bottom-right"
        onResizeStart={(x, y) => setStartMousePos({ x, y })}
        onResize={(x, y) => handleCornerResize({ x, y }, "bottom-right")}
      />
    </div>
  );
}

const CanvasTransformIndecatorMemo = memo(CanvasTransformIndecator);

function ElementTransformIndecator({
  transform,
  elementId,
}: {
  elementId: string;
  transform: iElementTransform;
}) {
  const updateElementState = useEditorStore(
    (state) => state.updateElementState,
  );

  const [startMousePos, setStartMousePos] = useState({ x: 0, y: 0 });
  const updateElementTransform = useEditorStore(
    (state) => state.updateElementTransform,
  );
  const elementRef = useRef<HTMLDivElement>(null);

  const style = useMemo(() => getTransform(transform), [transform]);

  const handleResizeStart = useCallback(
    (x: number, y: number) => {
      updateElementState(elementId, { resizing: true });
      setStartMousePos({ x, y });
    },
    [elementId, updateElementState],
  );

  const handleResizeEnd = useCallback(
    (x: number, y: number) => {
      updateElementState(elementId, { resizing: false });
      setStartMousePos({ x, y });
    },
    [elementId, updateElementState],
  );

  const handleCornerResize = useCallback(
    (
      pos: { x: number; y: number },
      position: "top-left" | "top-right" | "bottom-left" | "bottom-right",
    ) => {
      const elementWidth = transform.width * transform.scale;
      const elementHeight = transform.height * transform.scale;
      const elementMinWidth = transform.minWidth * transform.scale;
      const elementMinHeight = transform.minHeight * transform.scale;

      let width = elementWidth;
      let height = elementHeight;

      let x = transform.position.x;
      let y = transform.position.y;

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
        x = transform.position.x + dif;
        newStartPos.x = startMousePos.x;
      }

      if (height < elementMinHeight) {
        let dif = elementHeight - elementMinHeight;
        if (position === "bottom-left" || position === "bottom-right") {
          dif = 0;
        }
        height = elementMinHeight;
        y = transform.position.y + dif;
        newStartPos.y = startMousePos.y;
      }

      updateElementTransform(elementId, {
        ...transform,
        width: width / transform.scale,
        height: height / transform.scale,
        position: { x, y },
      });
      setStartMousePos(newStartPos);
    },
    [
      elementId,
      startMousePos.x,
      startMousePos.y,
      transform,
      updateElementTransform,
    ],
  );

  const handleSideResize = useCallback(
    (
      pos: { x: number; y: number },
      position: "left" | "right" | "top" | "bottom",
    ) => {
      const elementWidth = transform.width * transform.scale;
      const elementHeight = transform.height * transform.scale;
      const elementMinWidth = transform.minWidth * transform.scale;
      const elementMinHeight = transform.minHeight * transform.scale;

      let width = elementWidth;
      let height = elementHeight;
      let x = transform.position.x;
      let y = transform.position.y;

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
        x = transform.position.x + dif * (position === "left" ? 1 : 0);
        newStartPos.x = startMousePos.x;
      }
      if (height < elementMinHeight) {
        const dif = elementHeight - elementMinHeight;
        height = elementMinHeight;
        y = transform.position.y + dif * (position === "top" ? 1 : 0);
        newStartPos.y = startMousePos.y;
      }

      updateElementTransform(elementId, {
        ...transform,
        width: width / transform.scale,
        height: height / transform.scale,
        position: { x, y },
      });
      setStartMousePos(newStartPos);
    },
    [
      elementId,
      startMousePos.x,
      startMousePos.y,
      transform,
      updateElementTransform,
    ],
  );

  const handleRotate = useCallback(
    (mouseX: number, mouseY: number) => {
      if (!elementRef.current) {
        return;
      }

      const box = elementRef.current.getBoundingClientRect();
      const elementX = box.x + box.width / 2;
      const elementY = box.y + box.height / 2;

      const dx = mouseX - elementX;
      const dy = mouseY - elementY;

      // Calculate the angle in radians
      const angleInRadians = Math.atan2(dy, dx);

      // Convert the angle to degrees if needed
      const angleInDegrees = Math.round(angleInRadians * (180 / Math.PI));
      updateElementTransform(elementId, {
        ...transform,
        rotation: angleInDegrees + 90,
      });
    },
    [elementId, transform, updateElementTransform],
  );

  return (
    <div
      ref={elementRef}
      style={style}
      className="pointer-events-none absolute z-20"
    >
      <BarIndecator
        position="top"
        onResizeStart={handleResizeStart}
        onResizeEnd={handleResizeEnd}
        onResize={(x, y) => handleSideResize({ x, y }, "top")}
      />
      <BarIndecator
        position="right"
        onResizeStart={handleResizeStart}
        onResizeEnd={handleResizeEnd}
        onResize={(x, y) => handleSideResize({ x, y }, "right")}
      />
      <BarIndecator
        position="bottom"
        onResizeStart={handleResizeStart}
        onResizeEnd={handleResizeEnd}
        onResize={(x, y) => handleSideResize({ x, y }, "bottom")}
      />
      <BarIndecator
        position="left"
        onResizeStart={handleResizeStart}
        onResizeEnd={handleResizeEnd}
        onResize={(x, y) => handleSideResize({ x, y }, "left")}
      />
      <ScaleIndecator
        position="top-left"
        onResizeStart={handleResizeStart}
        onResizeEnd={handleResizeEnd}
        onResize={(x, y) => handleCornerResize({ x, y }, "top-left")}
      />
      <ScaleIndecator
        position="top-right"
        onResizeStart={handleResizeStart}
        onResizeEnd={handleResizeEnd}
        onResize={(x, y) => handleCornerResize({ x, y }, "top-right")}
      />
      <ScaleIndecator
        position="bottom-left"
        onResizeStart={handleResizeStart}
        onResizeEnd={handleResizeEnd}
        onResize={(x, y) => handleCornerResize({ x, y }, "bottom-left")}
      />
      <ScaleIndecator
        position="bottom-right"
        onResizeStart={handleResizeStart}
        onResizeEnd={handleResizeEnd}
        onResize={(x, y) => handleCornerResize({ x, y }, "bottom-right")}
      />
      <RotationIndecator
        onMove={handleRotate}
        onStart={() => updateElementState(elementId, { rotating: true })}
        onEnd={() => updateElementState(elementId, { rotating: false })}
      />
    </div>
  );
}

const ElementTransformIndecatorMemo = memo(ElementTransformIndecator);

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

function RotationIndecator({
  onMove,
  onEnd,
  onStart,
}: {
  onMove: (x: number, y: number) => void;
  onStart?: (x: number, y: number) => void;
  onEnd?: (x: number, y: number) => void;
}) {
  const [isRotating, setIsRotating] = useState(false);

  const handleMouseDown = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsRotating(true);
      document.documentElement.classList.add("cursor-grabbing", "select-none");
      onStart?.(e.clientX, e.clientY);
    },
    [onStart],
  );

  const handleMouseUp = useCallback(
    (e: globalThis.MouseEvent) => {
      e.preventDefault();
      setIsRotating(false);
      document.documentElement.classList.remove(
        "cursor-grabbing",
        "select-none",
      );
      onEnd?.(e.clientX, e.clientY);
    },
    [onEnd],
  );

  const handleMouseMove = useCallback(
    (e: globalThis.MouseEvent) => {
      onMove(e.clientX, e.clientY);
    },
    [onMove],
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
      className={cn(
        "pointer-events-auto absolute -top-6 left-1/2 h-4 w-4 -translate-x-1/2 cursor-grab rounded-full border-2 border-blue-500 bg-background",
        {
          "cursor-grabbing": isRotating,
        },
      )}
      onMouseDown={handleMouseDown}
    ></div>
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

function DraggingIndecator({ elementId }: { elementId: string }) {
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
      className="pointer-events-none absolute z-20"
    >
      <div className="absolute -top-8 left-0 z-20 flex h-6 w-fit items-center justify-center rounded-md border bg-background p-2 text-xs font-medium text-muted-foreground shadow-sm">
        X: {transform.position.x}, Y: {transform.position.y}
      </div>
    </div>
  );
}
function ResizeIndecator({ elementId }: { elementId: string }) {
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
      className="pointer-events-none absolute z-20"
    >
      <div className="absolute -top-8 left-0 z-20 flex h-6 w-fit items-center justify-center rounded-md border bg-background p-2 text-xs font-medium text-muted-foreground shadow-sm">
        {transform.width} x {transform.height}
      </div>
    </div>
  );
}
function RotatingIndecator({ elementId }: { elementId: string }) {
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
      className="pointer-events-none absolute z-20"
    >
      <div className="absolute -top-8 left-0 z-20 flex h-6 w-fit items-center justify-center rounded-md border bg-background p-2 text-xs font-medium text-muted-foreground shadow-sm">
        {transform.rotation}deg
      </div>
    </div>
  );
}

const HovernigIndecatorMemo = memo(HovernigIndecator);

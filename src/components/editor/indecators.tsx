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

import { useWindowSize } from "@/hooks/use-window-size";
import { cn } from "@/lib/utils";
import { iTransform } from "@/lib/validator/transform";
import { useSnippetStore } from "@/providers/snippet-provider";
import { useEditorStore } from "@/store/editor-store";

function getTransform(
  transform: iTransform,
  canvasSize: { width: number; height: number },
  windowSize: { width: number; height: number },
  viewPortOffset: { x: number; y: number },
  zoom: number,
): CSSProperties {
  const width = transform.width * transform.scale * zoom;
  const height = transform.height * transform.scale * zoom;

  const xOffset =
    windowSize.width / 2 +
    viewPortOffset.x -
    (canvasSize.width * zoom) / 2 +
    transform.position.x * zoom;

  const yOffset =
    windowSize.height / 2 +
    viewPortOffset.y -
    (canvasSize.height * zoom) / 2 +
    transform.position.y * zoom;

  return {
    width,
    height,

    left: xOffset,
    top: yOffset,

    transform: `rotate(${transform.rotation}deg)`,
  };
}

export function Indecators() {
  const elementState = useEditorStore((state) => state.elementState);
  const selectedElementId = useEditorStore((state) => state.selectedElementId);
  const selectedElement = useSnippetStore((state) =>
    selectedElementId
      ? (state.elements.find((element) => element.id === selectedElementId) ??
        null)
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
  const windowSize = useWindowSize();
  const canvasWidth = useSnippetStore((state) => state.transform.width);
  const canvasHeight = useSnippetStore((state) => state.transform.height);
  const viewPortOffset = useEditorStore((state) => state.viewPortOffset);
  const zoom = useEditorStore((state) => state.zoom);

  const canvasWidthHeightLinked = useSnippetStore(
    (state) => state.transform.widthHeightLinked,
  );
  const setCanvasTransform = useSnippetStore(
    (state) => state.updateSnippetTransform,
  );
  const canvasMinWidth = 200;
  const canvasMinHeight = 200;
  const [isResizing, setIsResizing] = useState(false);

  const [startMousePos, setStartMousePos] = useState({ x: 0, y: 0 });

  const onResizeStart = useCallback((x: number, y: number) => {
    setStartMousePos({ x, y });
    setIsResizing(true);
  }, []);

  const onResizeEnd = useCallback((x: number, y: number) => {
    setStartMousePos({ x, y });
    setIsResizing(false);
  }, []);

  const handleCornerResize = useCallback(
    (
      pos: { x: number; y: number },
      position: "top-left" | "top-right" | "bottom-left" | "bottom-right",
    ) => {
      let width = canvasWidth;
      let height = canvasHeight;

      const difX = ((startMousePos.x - pos.x) * 2) / zoom;
      const difY = ((startMousePos.y - pos.y) * 2) / zoom;

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

      setCanvasTransform({
        width,
        height,
      });
      setStartMousePos(newStartPos);
    },
    [
      canvasWidth,
      zoom,
      canvasHeight,
      startMousePos.x,
      startMousePos.y,
      setCanvasTransform,
    ],
  );

  const handleSideResize = useCallback(
    (
      pos: { x: number; y: number },
      position: "left" | "right" | "top" | "bottom",
    ) => {
      let width = canvasWidth;
      let height = canvasHeight;

      const difX = ((startMousePos.x - pos.x) * 2) / zoom;
      const difY = ((startMousePos.y - pos.y) * 2) / zoom;

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

      setCanvasTransform({ width, height });
      setStartMousePos(newStartPos);
    },
    [
      canvasWidth,
      zoom,
      canvasHeight,
      startMousePos.x,
      startMousePos.y,
      canvasWidthHeightLinked,
      setCanvasTransform,
    ],
  );

  return (
    <div
      style={getTransform(
        {
          height: canvasHeight,
          width: canvasWidth,
          position: { x: 0, y: 0 },
          rotation: 0,
          scale: 1,
          widthHeightLinked: false,
        },
        {
          height: canvasHeight,
          width: canvasWidth,
        },
        windowSize,
        viewPortOffset,
        zoom,
      )}
      className="pointer-events-none absolute z-20"
    >
      <BarIndecator
        position="top"
        onResizeStart={onResizeStart}
        onResizeEnd={onResizeEnd}
        onResize={(x, y) => handleSideResize({ x, y }, "top")}
      />
      <BarIndecator
        position="right"
        onResizeStart={onResizeStart}
        onResizeEnd={onResizeEnd}
        onResize={(x, y) => handleSideResize({ x, y }, "right")}
      />
      <BarIndecator
        position="bottom"
        onResizeStart={onResizeStart}
        onResizeEnd={onResizeEnd}
        onResize={(x, y) => handleSideResize({ x, y }, "bottom")}
      />
      <BarIndecator
        position="left"
        onResizeStart={onResizeStart}
        onResizeEnd={onResizeEnd}
        onResize={(x, y) => handleSideResize({ x, y }, "left")}
      />

      <ScaleIndecator
        position="top-left"
        onResizeStart={onResizeStart}
        onResizeEnd={onResizeEnd}
        onResize={(x, y) => handleCornerResize({ x, y }, "top-left")}
      />
      <ScaleIndecator
        position="top-right"
        onResizeStart={onResizeStart}
        onResizeEnd={onResizeEnd}
        onResize={(x, y) => handleCornerResize({ x, y }, "top-right")}
      />

      <ScaleIndecator
        position="bottom-left"
        onResizeStart={onResizeStart}
        onResizeEnd={onResizeEnd}
        onResize={(x, y) => handleCornerResize({ x, y }, "bottom-left")}
      />
      <ScaleIndecator
        position="bottom-right"
        onResizeStart={onResizeStart}
        onResizeEnd={onResizeEnd}
        onResize={(x, y) => handleCornerResize({ x, y }, "bottom-right")}
      />

      {isResizing && (
        <div className="absolute -top-8 left-0 z-20 flex h-6 w-fit items-center justify-center whitespace-pre rounded-md border bg-background p-2 text-xs font-medium text-muted-foreground shadow-sm">
          {canvasWidth} x {canvasHeight}
        </div>
      )}
    </div>
  );
}

const CanvasTransformIndecatorMemo = memo(CanvasTransformIndecator);

function ElementTransformIndecator({
  transform,
  elementId,
}: {
  elementId: string;
  transform: iTransform;
}) {
  const [startMousePos, setStartMousePos] = useState({ x: 0, y: 0 });
  const windowSize = useWindowSize();
  const updateElementState = useEditorStore(
    (state) => state.updateElementState,
  );
  const updateElementTransform = useSnippetStore(
    (state) => state.updateElementTransform,
  );
  const canvasWidth = useSnippetStore((state) => state.transform.width);
  const canvasHeight = useSnippetStore((state) => state.transform.height);
  const zoom = useEditorStore((state) => state.zoom);
  const viewPortOffset = useEditorStore((state) => state.viewPortOffset);

  const elementRef = useRef<HTMLDivElement>(null);

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
      const elementMinWidth = 20 * transform.scale;
      const elementMinHeight = 20 * transform.scale;

      let width = elementWidth;
      let height = elementHeight;

      let x = transform.position.x;
      let y = transform.position.y;

      const difX = (startMousePos.x - pos.x) / zoom;
      const difY = (startMousePos.y - pos.y) / zoom;

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
        width: Math.round(width / transform.scale),
        height: Math.round(height / transform.scale),
        position: { x: Math.round(x), y: Math.round(y) },
        autoWidth: false,
        autoHeight: false,
      });
      setStartMousePos(newStartPos);
    },
    [
      elementId,
      startMousePos.x,
      startMousePos.y,
      transform.height,
      transform.position.x,
      transform.position.y,
      transform.scale,
      transform.width,
      updateElementTransform,
      zoom,
    ],
  );

  const handleSideResize = useCallback(
    (
      pos: { x: number; y: number },
      position: "left" | "right" | "top" | "bottom",
    ) => {
      const elementWidth = transform.width * transform.scale;
      const elementHeight = transform.height * transform.scale;
      const elementMinWidth = 20 * transform.scale;
      const elementMinHeight = 20 * transform.scale;

      let width = elementWidth;
      let height = elementHeight;
      let x = transform.position.x;
      let y = transform.position.y;

      const difX = (startMousePos.x - pos.x) / zoom;
      const difY = (startMousePos.y - pos.y) / zoom;

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

      const updatedTransform: Partial<iTransform> = {
        width: Math.round(width / transform.scale),
        height: Math.round(height / transform.scale),
        position: { x: Math.round(x), y: Math.round(y) },
      };

      if (
        transform.autoWidth &&
        (position === "left" || position === "right")
      ) {
        updatedTransform.autoWidth = false;
      }
      if (
        transform.autoHeight &&
        (position === "top" || position === "bottom")
      ) {
        updatedTransform.autoHeight = false;
      }
      updateElementTransform(elementId, updatedTransform);
      setStartMousePos(newStartPos);
    },
    [
      elementId,
      startMousePos.x,
      startMousePos.y,
      transform.autoHeight,
      transform.autoWidth,
      transform.height,
      transform.position.x,
      transform.position.y,
      transform.scale,
      transform.width,
      updateElementTransform,
      zoom,
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
        rotation: angleInDegrees + 90,
      });
    },
    [elementId, updateElementTransform],
  );

  return (
    <div
      ref={elementRef}
      style={getTransform(
        transform,
        {
          height: canvasHeight,
          width: canvasWidth,
        },
        windowSize,
        viewPortOffset,
        zoom,
      )}
      className="z-2 pointer-events-none absolute"
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
      setIsResizing(true);
      onResizeStart?.(e.clientX, e.clientY);
      document.documentElement.classList.add(cursorClass, "select-none");
    },
    [onResizeStart, cursorClass],
  );

  const handleMouseUp = useCallback(
    (e: globalThis.MouseEvent) => {
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
      setIsResizing(true);
      onResizeStart?.(e.clientX, e.clientY);
      document.documentElement.classList.add(cursorClass, "select-none");
    },
    [cursorClass, onResizeStart],
  );

  const handleMouseUp = useCallback(
    (e: globalThis.MouseEvent) => {
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
      setIsRotating(true);
      document.documentElement.classList.add("cursor-grabbing", "select-none");
      onStart?.(e.clientX, e.clientY);
    },
    [onStart],
  );

  const handleMouseUp = useCallback(
    (e: globalThis.MouseEvent) => {
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
  const transform = useSnippetStore(
    (state) =>
      state.elements.find((element) => element.id === elementId)?.transform,
  );

  const zoom = useEditorStore((state) => state.zoom);
  const viewPortOffset = useEditorStore((state) => state.viewPortOffset);
  const windowSize = useWindowSize();

  const canvasWidth = useSnippetStore((state) => state.transform.width);
  const canvasHeight = useSnippetStore((state) => state.transform.height);

  if (!transform) {
    return null;
  }

  return (
    <div
      style={getTransform(
        transform,
        { width: canvasWidth, height: canvasHeight },
        windowSize,
        viewPortOffset,
        zoom,
      )}
      className="pointer-events-none absolute z-20 ring-2 ring-blue-500"
    ></div>
  );
}

function DraggingIndecator({ elementId }: { elementId: string }) {
  const transform = useSnippetStore(
    (state) =>
      state.elements.find((element) => element.id === elementId)?.transform,
  );
  const zoom = useEditorStore((state) => state.zoom);
  const viewPortOffset = useEditorStore((state) => state.viewPortOffset);
  const windowSize = useWindowSize();

  const canvasWidth = useSnippetStore((state) => state.transform.width);
  const canvasHeight = useSnippetStore((state) => state.transform.height);
  if (!transform) {
    return null;
  }

  return (
    <div
      style={getTransform(
        transform,
        { width: canvasWidth, height: canvasHeight },
        windowSize,
        viewPortOffset,
        zoom,
      )}
      className="pointer-events-none absolute z-20"
    >
      <div className="absolute -top-8 left-0 z-20 flex h-6 w-fit items-center justify-center whitespace-pre rounded-md border bg-background p-2 text-xs font-medium text-muted-foreground shadow-sm">
        X: {transform.position.x}, Y: {transform.position.y}
      </div>
    </div>
  );
}
function ResizeIndecator({ elementId }: { elementId: string }) {
  const transform = useSnippetStore(
    (state) =>
      state.elements.find((element) => element.id === elementId)?.transform,
  );
  const zoom = useEditorStore((state) => state.zoom);
  const viewPortOffset = useEditorStore((state) => state.viewPortOffset);
  const windowSize = useWindowSize();

  const canvasWidth = useSnippetStore((state) => state.transform.width);
  const canvasHeight = useSnippetStore((state) => state.transform.height);
  if (!transform) {
    return null;
  }

  return (
    <div
      style={getTransform(
        transform,
        { width: canvasWidth, height: canvasHeight },
        windowSize,
        viewPortOffset,
        zoom,
      )}
      className="pointer-events-none absolute z-20"
    >
      <div className="absolute -top-8 left-0 z-20 flex h-6 w-fit items-center justify-center whitespace-pre rounded-md border bg-background p-2 text-xs font-medium text-muted-foreground shadow-sm">
        {transform.width} x {transform.height}
      </div>
    </div>
  );
}
function RotatingIndecator({ elementId }: { elementId: string }) {
  const transform = useSnippetStore(
    (state) =>
      state.elements.find((element) => element.id === elementId)?.transform,
  );

  const zoom = useEditorStore((state) => state.zoom);
  const viewPortOffset = useEditorStore((state) => state.viewPortOffset);
  const windowSize = useWindowSize();

  const canvasWidth = useSnippetStore((state) => state.transform.width);
  const canvasHeight = useSnippetStore((state) => state.transform.height);
  if (!transform) {
    return null;
  }

  return (
    <div
      style={getTransform(
        transform,
        { width: canvasWidth, height: canvasHeight },
        windowSize,
        viewPortOffset,
        zoom,
      )}
      className="pointer-events-none absolute z-20"
    >
      <div className="absolute -top-8 left-0 z-20 flex h-6 w-fit items-center justify-center whitespace-pre rounded-md border bg-background p-2 text-xs font-medium text-muted-foreground shadow-sm">
        {transform.rotation}deg
      </div>
    </div>
  );
}

const HovernigIndecatorMemo = memo(HovernigIndecator);

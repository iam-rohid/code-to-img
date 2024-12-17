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
import { useStore } from "zustand";

import { cn } from "@/lib/utils";
import { iElement } from "@/lib/validator/elements";

import { useSnippetEditor } from "./snippet-editor";

function getTransform(
  element: Pick<
    iElement,
    "width" | "height" | "scale" | "x" | "y" | "rotation"
  >,
  canvasSize: { width: number; height: number },
  windowSize: { width: number; height: number },
  scrollX: number,
  scrollY: number,
  zoom: number,
): CSSProperties {
  const width = element.width * element.scale * zoom;
  const height = element.height * element.scale * zoom;

  const xOffset =
    windowSize.width / 2 +
    scrollX -
    (canvasSize.width * zoom) / 2 +
    element.x * zoom;

  const yOffset =
    windowSize.height / 2 +
    scrollY -
    (canvasSize.height * zoom) / 2 +
    element.y * zoom;

  return {
    width,
    height,

    left: xOffset,
    top: yOffset,

    transform: `rotate(${element.rotation}deg)`,
  };
}

export function Indecators() {
  const { snippetStore, editorStore } = useSnippetEditor();
  const elementState = useStore(editorStore, (state) => state.elementState);
  const selectedElementId = useStore(
    editorStore,
    (state) => state.selectedElementId,
  );
  const selectedElement = useStore(snippetStore, (state) =>
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
          element={selectedElement}
        />
      ) : null}
    </>
  );
}

export const IndecatorsMemo = memo(Indecators);

function CanvasTransformIndecator() {
  const { size: editorSize, snippetStore, editorStore } = useSnippetEditor();
  const canvasWidth = useStore(snippetStore, (state) => state.width);
  const canvasHeight = useStore(snippetStore, (state) => state.height);
  const scrollX = useStore(editorStore, (state) => state.scrollX);
  const scrollY = useStore(editorStore, (state) => state.scrollY);
  const canvasWidthHeightLinked = useStore(
    snippetStore,
    (state) => state.widthHeightLinked,
  );
  const updateSnippet = useStore(snippetStore, (state) => state.updateSnippet);

  const zoom = useStore(editorStore, (state) => state.zoom);

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

      updateSnippet({
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
      updateSnippet,
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

      updateSnippet({ width, height });
      setStartMousePos(newStartPos);
    },
    [
      canvasWidth,
      zoom,
      canvasHeight,
      startMousePos.x,
      startMousePos.y,
      canvasWidthHeightLinked,
      updateSnippet,
    ],
  );

  return (
    <div
      style={getTransform(
        {
          height: canvasHeight,
          width: canvasWidth,
          x: 0,
          y: 0,
          rotation: 0,
          scale: 1,
        },
        {
          height: canvasHeight,
          width: canvasWidth,
        },
        editorSize,
        scrollX,
        scrollY,
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
  element,
  elementId,
}: {
  elementId: string;
  element: iElement;
}) {
  const [startMousePos, setStartMousePos] = useState({ x: 0, y: 0 });
  const { size: editorSize, snippetStore, editorStore } = useSnippetEditor();
  const updateElementState = useStore(
    editorStore,
    (state) => state.updateElementState,
  );
  const updateElement = useStore(snippetStore, (state) => state.updateElement);
  const canvasWidth = useStore(snippetStore, (state) => state.width);
  const canvasHeight = useStore(snippetStore, (state) => state.height);
  const zoom = useStore(editorStore, (state) => state.zoom);
  const scrollX = useStore(editorStore, (state) => state.scrollX);
  const scrollY = useStore(editorStore, (state) => state.scrollY);

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
      const elementWidth = element.width * element.scale;
      const elementHeight = element.height * element.scale;
      const elementMinWidth = 20 * element.scale;
      const elementMinHeight = 20 * element.scale;

      let width = elementWidth;
      let height = elementHeight;

      let x = element.x;
      let y = element.y;

      const difX = (startMousePos.x - pos.x) / zoom;
      const difY = (startMousePos.y - pos.y) / zoom;

      switch (position) {
        case "top-left":
          width += difX;
          x -= difX;
          if (element.widthHeightLinked) {
            height = (elementHeight * width) / elementWidth;
            y -= height - elementHeight;
          } else {
            height += difY;
            y -= difY;
          }
          break;
        case "top-right":
          width -= difX;
          if (element.widthHeightLinked) {
            height = (elementHeight * width) / elementWidth;
            y -= height - elementHeight;
          } else {
            height += difY;
            y -= difY;
          }
          break;
        case "bottom-left":
          width += difX;
          if (element.widthHeightLinked) {
            height = (elementHeight * width) / elementWidth;
            x -= width - elementWidth;
          } else {
            height -= difY;
            x -= difX;
          }
          break;
        case "bottom-right":
          width -= difX;
          if (element.widthHeightLinked) {
            height = (elementHeight * width) / elementWidth;
          } else {
            height -= difY;
          }
          break;

        default:
          break;
      }

      const newStartPos = pos;

      if (width < elementMinWidth) {
        if (element.widthHeightLinked) {
          width = element.width;
          height = element.height;
          x = element.x;
          y = element.y;
        } else {
          let dif = elementWidth - elementMinWidth;
          if (position === "top-right" || position === "bottom-right") {
            dif = 0;
          }
          width = elementMinWidth;
          x = element.x + dif;
          newStartPos.x = startMousePos.x;
        }
      }

      if (height < elementMinHeight) {
        if (element.widthHeightLinked) {
          width = element.width;
          height = element.height;
          x = element.x;
          y = element.y;
        } else {
          let dif = elementHeight - elementMinHeight;
          if (position === "bottom-left" || position === "bottom-right") {
            dif = 0;
          }
          height = elementMinHeight;
          y = element.y + dif;
          newStartPos.y = startMousePos.y;
        }
      }

      updateElement(elementId, {
        width: width / element.scale,
        height: height / element.scale,
        x: x,
        y: y,
        autoWidth: false,
        autoHeight: false,
      });
      setStartMousePos(newStartPos);
    },
    [
      element.width,
      element.scale,
      element.height,
      element.x,
      element.y,
      element.widthHeightLinked,
      startMousePos.x,
      startMousePos.y,
      zoom,
      updateElement,
      elementId,
    ],
  );

  const handleSideResize = useCallback(
    (
      pos: { x: number; y: number },
      position: "left" | "right" | "top" | "bottom",
    ) => {
      const elementWidth = element.width * element.scale;
      const elementHeight = element.height * element.scale;
      const elementMinWidth = 20 * element.scale;
      const elementMinHeight = 20 * element.scale;

      let width = elementWidth;
      let height = elementHeight;
      let x = element.x;
      let y = element.y;

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

      if (element.widthHeightLinked) {
        switch (position) {
          case "left":
          case "right":
            height = (elementHeight * width) / elementWidth;
            y -= (height - elementHeight) / 2;
            break;
          case "top":
          case "bottom":
            width = (elementWidth * height) / elementHeight;
            x -= (width - elementWidth) / 2;
            break;

          default:
            break;
        }
      }

      const newStartPos = pos;

      if (width < elementMinWidth) {
        if (element.widthHeightLinked) {
          width = element.width;
          height = element.height;
          x = element.x;
          y = element.y;
        } else {
          const dif = elementWidth - elementMinWidth;
          width = elementMinWidth;
          x = element.x + dif * (position === "left" ? 1 : 0);
          newStartPos.x = startMousePos.x;
        }
      }
      if (height < elementMinHeight) {
        if (element.widthHeightLinked) {
          width = element.width;
          height = element.height;
          x = element.x;
          y = element.y;
        } else {
          const dif = elementHeight - elementMinHeight;
          height = elementMinHeight;
          y = element.y + dif * (position === "top" ? 1 : 0);
          newStartPos.y = startMousePos.y;
        }
      }

      const updatedTransform: Partial<iElement> = {
        width: width / element.scale,
        height: height / element.scale,
        x: x,
        y: y,
      };

      if (element.widthHeightLinked) {
        updatedTransform.autoHeight = false;
        updatedTransform.autoWidth = false;
      } else {
        if (position === "left" || position === "right") {
          updatedTransform.autoWidth = false;
        }
        if (position === "top" || position === "bottom") {
          updatedTransform.autoHeight = false;
        }
      }
      updateElement(elementId, updatedTransform);
      setStartMousePos(newStartPos);
    },
    [
      element.width,
      element.scale,
      element.height,
      element.x,
      element.y,
      element.widthHeightLinked,
      startMousePos.x,
      startMousePos.y,
      zoom,
      updateElement,
      elementId,
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
      updateElement(elementId, {
        rotation: angleInDegrees + 90,
      });
    },
    [elementId, updateElement],
  );

  return (
    <div
      ref={elementRef}
      style={getTransform(
        element,
        {
          height: canvasHeight,
          width: canvasWidth,
        },
        editorSize,
        scrollX,
        scrollY,
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
        "pointer-events-auto absolute z-20 h-4 w-4 rounded-full border-2 border-white bg-blue-500",
        {
          "-left-2 -top-2": position === "top-left",
          "-right-2 -top-2": position === "top-right",
          "-bottom-2 -left-2": position === "bottom-left",
          "-bottom-2 -right-2": position === "bottom-right",
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
      className={cn("pointer-events-auto absolute z-10", cursorClass, {
        "-top-1 left-0 right-0 h-2": position === "top",
        "-bottom-1 left-0 right-0 h-2": position === "bottom",
        "-right-1 bottom-0 top-0 w-2": position === "right",
        "-left-1 bottom-0 top-0 w-2": position === "left",
      })}
    >
      <div
        className={cn("absolute bg-blue-500", {
          "left-0 right-0 top-1/2 h-[2px] -translate-y-1/2":
            position === "top" || position === "bottom",
          "bottom-0 left-1/2 top-0 w-[2px] -translate-x-1/2":
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
    <>
      <div
        className={cn(
          "pointer-events-auto absolute -top-10 left-1/2 h-4 w-4 -translate-x-1/2 cursor-grab rounded-full border-2 border-blue-500 bg-white",
          {
            "cursor-grabbing": isRotating,
          },
        )}
        onMouseDown={handleMouseDown}
      ></div>
      <div className="absolute -top-6 left-1/2 h-6 w-[2px] -translate-x-1/2 bg-blue-500"></div>
    </>
  );
}

function HovernigIndecator({ elementId }: { elementId: string }) {
  const { size: editorSize, snippetStore, editorStore } = useSnippetEditor();

  const element = useStore(snippetStore, (state) =>
    state.elements.find((element) => element.id === elementId),
  );

  const zoom = useStore(editorStore, (state) => state.zoom);
  const scrollX = useStore(editorStore, (state) => state.scrollX);
  const scrollY = useStore(editorStore, (state) => state.scrollY);

  const canvasWidth = useStore(snippetStore, (state) => state.width);
  const canvasHeight = useStore(snippetStore, (state) => state.height);

  if (!element) {
    return null;
  }

  return (
    <div
      style={getTransform(
        element,
        { width: canvasWidth, height: canvasHeight },
        editorSize,
        scrollX,
        scrollY,
        zoom,
      )}
      className="pointer-events-none absolute z-20 ring-2 ring-blue-500"
    ></div>
  );
}

function DraggingIndecator({ elementId }: { elementId: string }) {
  const { size: editorSize, snippetStore, editorStore } = useSnippetEditor();
  const element = useStore(snippetStore, (state) =>
    state.elements.find((element) => element.id === elementId),
  );
  const zoom = useStore(editorStore, (state) => state.zoom);
  const scrollX = useStore(editorStore, (state) => state.scrollX);
  const scrollY = useStore(editorStore, (state) => state.scrollY);

  const canvasWidth = useStore(snippetStore, (state) => state.width);
  const canvasHeight = useStore(snippetStore, (state) => state.height);
  if (!element) {
    return null;
  }

  return (
    <div
      style={getTransform(
        element,
        { width: canvasWidth, height: canvasHeight },
        editorSize,
        scrollX,
        scrollY,
        zoom,
      )}
      className="pointer-events-none absolute z-20"
    >
      <div className="absolute -top-8 left-0 z-20 flex h-6 w-fit items-center justify-center whitespace-pre rounded-md border bg-background p-2 text-xs font-medium text-muted-foreground shadow-sm">
        X: {element.x.toFixed(2)}, Y: {element.y.toFixed(2)}
      </div>
    </div>
  );
}
function ResizeIndecator({ elementId }: { elementId: string }) {
  const { size: editorSize, snippetStore, editorStore } = useSnippetEditor();
  const element = useStore(snippetStore, (state) =>
    state.elements.find((element) => element.id === elementId),
  );
  const zoom = useStore(editorStore, (state) => state.zoom);
  const scrollX = useStore(editorStore, (state) => state.scrollX);
  const scrollY = useStore(editorStore, (state) => state.scrollY);

  const canvasWidth = useStore(snippetStore, (state) => state.width);
  const canvasHeight = useStore(snippetStore, (state) => state.height);
  if (!element) {
    return null;
  }

  return (
    <div
      style={getTransform(
        element,
        { width: canvasWidth, height: canvasHeight },
        editorSize,
        scrollX,
        scrollY,
        zoom,
      )}
      className="pointer-events-none absolute z-20"
    >
      <div className="absolute -top-8 left-0 z-20 flex h-6 w-fit items-center justify-center whitespace-pre rounded-md border bg-background p-2 text-xs font-medium text-muted-foreground shadow-sm">
        {element.width.toFixed(2)} x {element.height.toFixed(2)}
      </div>
    </div>
  );
}
function RotatingIndecator({ elementId }: { elementId: string }) {
  const { size: editorSize, snippetStore, editorStore } = useSnippetEditor();
  const element = useStore(snippetStore, (state) =>
    state.elements.find((element) => element.id === elementId),
  );

  const zoom = useStore(editorStore, (state) => state.zoom);
  const scrollX = useStore(editorStore, (state) => state.scrollX);
  const scrollY = useStore(editorStore, (state) => state.scrollY);

  const canvasWidth = useStore(snippetStore, (state) => state.width);
  const canvasHeight = useStore(snippetStore, (state) => state.height);
  if (!element) {
    return null;
  }

  return (
    <div
      style={getTransform(
        element,
        { width: canvasWidth, height: canvasHeight },
        editorSize,
        scrollX,
        scrollY,
        zoom,
      )}
      className="pointer-events-none absolute z-20"
    >
      <div className="absolute -top-8 left-0 z-20 flex h-6 w-fit items-center justify-center whitespace-pre rounded-md border bg-background p-2 text-xs font-medium text-muted-foreground shadow-sm">
        {element.rotation.toFixed(2)}deg
      </div>
    </div>
  );
}

const HovernigIndecatorMemo = memo(HovernigIndecator);

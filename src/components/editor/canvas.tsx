"use client";

import { iElement, useEditorStore } from "@/store/editor-store";
import {
  CSSProperties,
  MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import CodeEditorElement from "./elements/code-editor";
import { cn } from "@/lib/utils";

export default function Canvas() {
  const width = useEditorStore((state) => state.canvas.width);
  const height = useEditorStore((state) => state.canvas.height);
  const elements = useEditorStore((state) => state.canvas.elements);

  return (
    <div
      style={{
        width,
        height,
      }}
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border border-primary bg-background"
    >
      {elements.map((element) => (
        <Element elementId={element.id} key={element.id} />
      ))}

      <Indecators />
    </div>
  );
}

function Element({ elementId }: { elementId: string }) {
  const element = useEditorStore((state) =>
    state.canvas.elements.find((element) => element.id === elementId),
  );
  const state = useEditorStore((state) => state.elementState[elementId]);
  const updateElementState = useEditorStore(
    (state) => state.updateElementState,
  );
  const setSelectedElement = useEditorStore(
    (state) => state.setSelectedElement,
  );

  const offset = useMemo(() => {
    if (!element) {
      return {
        x: 0,
        y: 0,
      };
    }
    return {
      x: (element.width * element.scale - element.width) / 2,
      y: (element.height * element.scale - element.height) / 2,
    };
  }, [element]);

  const handleMouseEnter = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      updateElementState(elementId, { ...state, hovering: true });
    },
    [elementId, state, updateElementState],
  );

  const handleMouseLeave = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      updateElementState(elementId, { ...state, hovering: false });
    },
    [elementId, state, updateElementState],
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
        left: element.position.x,
        top: element.position.y,

        width: element.width,
        height: element.height,

        transform: `translate(${offset.x}px, ${offset.y}px) rotate(${element.rotation}deg) scale(${element.scale})`,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      className="absolute"
    >
      {element.type === "code-editor" ? (
        <CodeEditorElement element={element} />
      ) : null}
    </div>
  );
}

function getTransform(element: iElement): CSSProperties {
  const width = element.width * element.scale;
  const height = element.height * element.scale;
  // const offsetX = (width - element.width) / 2;
  // const offsetY = (height - element.height) / 2;

  return {
    width,
    height,

    left: element.position.x,
    top: element.position.y,

    transform: `rotate(${element.rotation}deg)`,
  };
}

function Indecators() {
  const elementState = useEditorStore((state) => state.elementState);
  const selectedElement = useEditorStore((state) =>
    state.selectedElementId
      ? (state.canvas.elements.find(
          (element) => element.id === state.selectedElementId,
        ) ?? null)
      : null,
  );

  return (
    <>
      {Object.entries(elementState).map(([elementId, state]) => {
        if (
          state.hovering &&
          !(selectedElement && elementId === selectedElement.id)
        ) {
          return <HovernigIndecator key={elementId} elementId={elementId} />;
        }
        return null;
      })}
      {selectedElement && <TransformIndecator element={selectedElement} />}
    </>
  );
}

function TransformIndecator({ element }: { element: iElement }) {
  const [startMousePos, setStartMousePos] = useState({ x: 0, y: 0 });
  const setElement = useEditorStore((state) => state.setElement);

  const handleResize = useCallback(
    (
      pos: { x: number; y: number },
      position: "top-left" | "top-right" | "bottom-left" | "bottom-right",
    ) => {
      let width = element.width * element.scale;
      let height = element.height * element.scale;

      let x = element.position.x;
      let y = element.position.y;

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

      if (width < element.minWidth * element.scale) {
        let dif =
          element.width * element.scale - element.minWidth * element.scale;
        if (position === "top-right" || position === "bottom-right") {
          dif = 0;
        }
        width = element.minWidth * element.scale;
        x = element.position.x + dif;
        newStartPos.x = startMousePos.x;
      }

      if (height < element.minHeight * element.scale) {
        let dif =
          element.height * element.scale - element.minHeight * element.scale;
        if (position === "bottom-left" || position === "bottom-right") {
          dif = 0;
        }
        height = element.minHeight * element.scale;
        y = element.position.y + dif;
        newStartPos.y = startMousePos.y;
      }

      setElement({
        ...element,
        width: width / element.scale,
        height: height / element.scale,
        position: { x, y },
      });
      setStartMousePos(newStartPos);
    },
    [element, setElement, startMousePos.x, startMousePos.y],
  );

  const handleResize2 = useCallback(
    (
      pos: { x: number; y: number },
      position: "left" | "right" | "top" | "bottom",
    ) => {
      let width = element.width * element.scale;
      let height = element.height * element.scale;
      let x = element.position.x;
      let y = element.position.y;

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

      if (width <= element.minWidth * element.scale) {
        const dif =
          element.width * element.scale - element.minWidth * element.scale;
        width = element.minWidth * element.scale;
        x = element.position.x + dif * (position === "left" ? 1 : 0);
        newStartPos.x = startMousePos.x;
      }
      if (height <= element.minHeight * element.scale) {
        const dif =
          element.height * element.scale - element.minHeight * element.scale;
        height = element.minHeight * element.scale;
        y = element.position.y + dif * (position === "top" ? 1 : 0);
        newStartPos.y = startMousePos.y;
      }

      setElement({
        ...element,
        width: width / element.scale,
        height: height / element.scale,
        position: { x, y },
      });
      setStartMousePos(pos);
    },
    [element, setElement, startMousePos.x, startMousePos.y],
  );

  return (
    <div
      style={getTransform(element)}
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
        onResize={(mouseX, mouseY) =>
          handleResize({ x: mouseX, y: mouseY }, "top-left")
        }
      />
      <ScaleIndecator
        position="top-right"
        onResizeStart={(x, y) => setStartMousePos({ x, y })}
        onResize={(mouseX, mouseY) =>
          handleResize({ x: mouseX, y: mouseY }, "top-right")
        }
      />

      <ScaleIndecator
        position="bottom-left"
        onResizeStart={(x, y) => setStartMousePos({ x, y })}
        onResize={(mouseX, mouseY) =>
          handleResize({ x: mouseX, y: mouseY }, "bottom-left")
        }
      />
      <ScaleIndecator
        position="bottom-right"
        onResizeStart={(x, y) => setStartMousePos({ x, y })}
        onResize={(mouseX, mouseY) =>
          handleResize({ x: mouseX, y: mouseY }, "bottom-right")
        }
      />
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
        "pointer-events-auto absolute z-20 h-2 w-2 border-2 border-blue-500 bg-white",
        {
          "-left-1 -top-1": position === "top-left",
          "-right-1 -top-1": position === "top-right",
          "-bottom-1 -left-1": position === "bottom-left",
          "-bottom-1 -right-1": position === "bottom-right",
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
  const element = useEditorStore((state) =>
    state.canvas.elements.find((element) => element.id === elementId),
  );

  if (!element) {
    return null;
  }

  return (
    <div
      style={getTransform(element)}
      className="pointer-events-none absolute z-20 ring-2 ring-blue-500"
    ></div>
  );
}

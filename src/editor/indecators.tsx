import {
  CSSProperties,
  MouseEvent,
  useCallback,
  useEffect,
  useMemo,
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
  const selectedElementTransform = useEditorStore((state) =>
    selectedElementId
      ? (state.canvas.elements.find(
          (element) => element.id === selectedElementId,
        )?.transform ?? null)
      : null,
  );

  return (
    <>
      {Object.entries(elementState).map(([elementId, state]) => {
        if (
          state.hovering &&
          !(selectedElementTransform && elementId === selectedElementId)
        ) {
          return <HovernigIndecator key={elementId} elementId={elementId} />;
        }
        return null;
      })}
      {selectedElementId && selectedElementTransform && (
        <TransformIndecator
          elementId={selectedElementId}
          transform={selectedElementTransform}
        />
      )}
    </>
  );
}

function TransformIndecator({
  elementId,
  transform,
}: {
  elementId: string;
  transform: iElementTransform;
}) {
  const [startMousePos, setStartMousePos] = useState({ x: 0, y: 0 });
  const updateElement = useEditorStore((state) => state.updateElement);

  const handleResize = useCallback(
    (
      pos: { x: number; y: number },
      position: "top-left" | "top-right" | "bottom-left" | "bottom-right",
    ) => {
      let width = transform.width * transform.scale;
      let height = transform.height * transform.scale;

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

      if (width < transform.minWidth * transform.scale) {
        let dif =
          transform.width * transform.scale -
          transform.minWidth * transform.scale;
        if (position === "top-right" || position === "bottom-right") {
          dif = 0;
        }
        width = transform.minWidth * transform.scale;
        x = transform.position.x + dif;
        newStartPos.x = startMousePos.x;
      }

      if (height < transform.minHeight * transform.scale) {
        let dif =
          transform.height * transform.scale -
          transform.minHeight * transform.scale;
        if (position === "bottom-left" || position === "bottom-right") {
          dif = 0;
        }
        height = transform.minHeight * transform.scale;
        y = transform.position.y + dif;
        newStartPos.y = startMousePos.y;
      }

      updateElement(elementId, {
        transform: {
          ...transform,
          width: width / transform.scale,
          height: height / transform.scale,
          position: { x, y },
        },
      });
      setStartMousePos(newStartPos);
    },
    [transform, startMousePos.x, startMousePos.y, updateElement, elementId],
  );

  const handleResize2 = useCallback(
    (
      pos: { x: number; y: number },
      position: "left" | "right" | "top" | "bottom",
    ) => {
      let width = transform.width * transform.scale;
      let height = transform.height * transform.scale;
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

      if (width <= transform.minWidth * transform.scale) {
        const dif =
          transform.width * transform.scale -
          transform.minWidth * transform.scale;
        width = transform.minWidth * transform.scale;
        x = transform.position.x + dif * (position === "left" ? 1 : 0);
        newStartPos.x = startMousePos.x;
      }
      if (height <= transform.minHeight * transform.scale) {
        const dif =
          transform.height * transform.scale -
          transform.minHeight * transform.scale;
        height = transform.minHeight * transform.scale;
        y = transform.position.y + dif * (position === "top" ? 1 : 0);
        newStartPos.y = startMousePos.y;
      }

      updateElement(elementId, {
        transform: {
          ...transform,
          width: width / transform.scale,
          height: height / transform.scale,
          position: { x, y },
        },
      });
      setStartMousePos(pos);
    },
    [transform, startMousePos.x, startMousePos.y, updateElement, elementId],
  );

  return (
    <div
      style={getTransform(transform)}
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

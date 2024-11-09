"use client";

import { useCallback, WheelEvent } from "react";
import Canvas from "./canvas";
import { useEditorStore } from "./store";
import UI from "./ui";

export default function Editor() {
  const setSelectedElement = useEditorStore(
    (state) => state.setSelectedElement,
  );
  const viewPortOffset = useEditorStore((state) => state.viewPortOffset);
  const setViewPortOffset = useEditorStore((state) => state.setViewPortOffset);
  const setZoom = useEditorStore((state) => state.setZoom);
  const zoom = useEditorStore((state) => state.zoom);

  const handleScroll = useCallback(
    (e: WheelEvent<HTMLDivElement>) => {
      if (e.metaKey) {
        setZoom(Math.min(3, Math.max(0.1, zoom - e.deltaY * 0.01)));
      } else {
        setViewPortOffset({
          x: viewPortOffset.x - e.deltaX,
          y: viewPortOffset.y - e.deltaY,
        });
      }
    },
    [setViewPortOffset, setZoom, viewPortOffset.x, viewPortOffset.y, zoom],
  );

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden bg-secondary">
      <div
        className="absolute bottom-0 left-0 right-0 top-0 overflow-hidden"
        onWheel={handleScroll}
      >
        <div
          className="absolute inset-0"
          onClick={() => setSelectedElement(null)}
        ></div>
        <div
          className="absolute left-1/2 top-1/2"
          style={{
            transform: `
              translate(${viewPortOffset.x}px, ${viewPortOffset.y}px) 
              scale(${zoom})
            `,
          }}
        >
          <Canvas />
        </div>
      </div>
      <UI />
    </div>
  );
}

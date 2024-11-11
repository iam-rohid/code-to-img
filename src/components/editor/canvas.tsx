"use client";

import { getBackgroundStyle } from "@/lib/utils/editor";
import { useEditorStore } from "@/store/editor-store";

import { ElementMemo } from "./element";
import { IndecatorsMemo } from "./indecators";

export default function Canvas() {
  const width = useEditorStore((state) => state.canvas.width);
  const height = useEditorStore((state) => state.canvas.height);
  const background = useEditorStore((state) => state.canvas.background);
  const elements = useEditorStore((state) => state.canvas.elements);
  const setSelectedElement = useEditorStore(
    (state) => state.setSelectedElement,
  );

  return (
    <div
      style={{ width, height }}
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
    >
      <div
        className="absolute inset-0"
        style={background.color ? getBackgroundStyle(background.color) : {}}
        onClick={() => setSelectedElement("canvas")}
      ></div>

      <div className="pointer-events-none absolute inset-0 z-10">
        {elements.toReversed().map((element) => (
          <ElementMemo element={element} key={element.id} />
        ))}
      </div>

      <div className="pointer-events-none absolute inset-0 z-20 ring-[9999px] ring-secondary/80"></div>

      <IndecatorsMemo />
    </div>
  );
}

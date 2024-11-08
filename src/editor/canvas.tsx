"use client";

import { useEditorStore } from "./store";
import Element from "./elements/element";
import { Indecators } from "./indecators";

export default function Canvas() {
  const width = useEditorStore((state) => state.canvas.width);
  const height = useEditorStore((state) => state.canvas.height);
  const elements = useEditorStore((state) => state.canvas.elements);
  const setSelectedElement = useEditorStore(
    (state) => state.setSelectedElement,
  );

  return (
    <div
      style={{
        width,
        height,
      }}
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
    >
      <div
        className="absolute inset-0 bg-background"
        onClick={() => setSelectedElement(null)}
      ></div>

      {elements.map((element) => (
        <Element elementId={element.id} key={element.id} />
      ))}

      <Indecators />
    </div>
  );
}

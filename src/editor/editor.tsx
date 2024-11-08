"use client";

import Canvas from "./canvas";
import { useEditorStore } from "./store";
import UI from "./ui";

export default function Editor() {
  const setSelectedElement = useEditorStore(
    (state) => state.setSelectedElement,
  );

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden bg-secondary/50">
      <div
        className="absolute inset-0"
        onClick={() => setSelectedElement(null)}
      ></div>
      <Canvas />
      <UI />
    </div>
  );
}

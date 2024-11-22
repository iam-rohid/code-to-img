"use client";

import { useStore } from "zustand";

import { getBackgroundStyle } from "@/lib/utils/editor";

import { useEditor } from "./editor";
import { ElementMemo } from "./element";

export default function Canvas() {
  const { store, readOnly, editorStore } = useEditor();
  const width = useStore(store, (state) => state.transform.width);
  const height = useStore(store, (state) => state.transform.height);
  const background = useStore(store, (state) => state.background);
  const elements = useStore(store, (state) => state.elements);
  const setSelectedElement = useStore(
    editorStore,
    (state) => state.setSelectedElement,
  );

  return (
    <div
      style={{ width, height }}
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
    >
      <div
        className="absolute inset-0 z-0"
        style={background.color ? getBackgroundStyle(background.color) : {}}
        onClick={() => {
          if (!readOnly) {
            setSelectedElement("canvas");
          }
        }}
      ></div>

      <div className="pointer-events-none absolute inset-0 z-10">
        {elements.toReversed().map((element) => (
          <ElementMemo element={element} key={element.id} />
        ))}
      </div>

      <div className="pointer-events-none absolute inset-0 z-20 ring-[9999px] ring-background/80"></div>
    </div>
  );
}

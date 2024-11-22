"use client";

import { useStore } from "zustand";

import { getBackgroundStyle } from "@/lib/utils/editor";

import { ElementMemo } from "./element";
import { useSnippetEditor } from "./snippet-editor";

export default function Canvas() {
  const { snippetStore, readOnly, editorStore } = useSnippetEditor();
  const width = useStore(snippetStore, (state) => state.transform.width);
  const height = useStore(snippetStore, (state) => state.transform.height);
  const background = useStore(snippetStore, (state) => state.background);
  const elements = useStore(snippetStore, (state) => state.elements);
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

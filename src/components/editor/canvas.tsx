"use client";

import { getBackgroundStyle } from "@/lib/utils/editor";
import { useSnippetStore } from "@/providers/snippet-provider";
import { useEditorStore } from "@/store/editor-store";

import { ElementMemo } from "./element";

export default function Canvas() {
  const width = useSnippetStore((state) => state.transform.width);
  const height = useSnippetStore((state) => state.transform.height);
  const background = useSnippetStore((state) => state.background);
  const elements = useSnippetStore((state) => state.elements);
  const setSelectedElement = useEditorStore(
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
        onClick={() => setSelectedElement("canvas")}
      ></div>

      <div className="pointer-events-none absolute inset-0 z-10">
        {elements.toReversed().map((element) => (
          <ElementMemo element={element} key={element.id} />
        ))}
      </div>

      <div className="pointer-events-none absolute inset-0 z-20 ring-[9999px] ring-secondary/80"></div>
    </div>
  );
}

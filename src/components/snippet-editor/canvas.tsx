/* eslint-disable @next/next/no-img-element */
"use client";

import { useRef } from "react";
import { useStore } from "zustand";
import { useShallow } from "zustand/react/shallow";

import { getBackgroundStyle } from "@/lib/utils/editor";

import Element from "./element";
import { useSnippetEditor } from "./snippet-editor";

export default function Canvas() {
  const { snippetStore, readOnly, editorStore } = useSnippetEditor();
  const width = useStore(snippetStore, (state) => state.width);
  const height = useStore(snippetStore, (state) => state.height);
  const background = useStore(snippetStore, (state) => state.background);
  const elementIds = useStore(
    snippetStore,
    useShallow((state) => state.elements.map((el) => el.id).toReversed()),
  );
  const setSelectedElement = useStore(
    editorStore,
    (state) => state.setSelectedElement,
  );
  const canvasRef = useRef<HTMLDivElement | null>(null);

  return (
    <div
      style={{ width, height }}
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      ref={canvasRef}
    >
      <div
        className="absolute inset-0 z-0 overflow-hidden"
        style={
          background.color ? getBackgroundStyle(background.color) : undefined
        }
        onClick={() => {
          if (!readOnly) {
            setSelectedElement("canvas");
          }
        }}
      >
        {background.image && (
          <img
            src={background.image}
            alt="Background Image"
            className="absolute inset-0 h-full w-full"
            style={{
              objectFit: background.imageFill ?? "cover",
            }}
          />
        )}
      </div>

      <div className="pointer-events-none absolute inset-0 z-10">
        {elementIds.map((elementId) => (
          <Element elementId={elementId} key={elementId} />
        ))}
      </div>

      <div className="pointer-events-none absolute inset-0 z-20 ring-[9999px] ring-background/80"></div>
    </div>
  );
}

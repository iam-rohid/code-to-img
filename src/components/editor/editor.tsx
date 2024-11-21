"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  WheelEvent,
} from "react";

import useElementSize from "@/hooks/use-element-size";
import { useSnippetData } from "@/providers/snippet-data-provider";
import {
  SnippetStoreContext,
  SnippetStoreProvider,
} from "@/providers/snippet-store-provider";
import { useEditorStore } from "@/store/editor-store";

import Canvas from "./canvas";
import EditorUI from "./editor-ui";
import { IndecatorsMemo } from "./indecators";

export type EditorContextValue = {
  size: {
    width: number;
    height: number;
  };
};

export const EditorContext = createContext<EditorContextValue | null>(null);

export default function Editor() {
  const { snippetData } = useSnippetData();
  const { ref, height, width } = useElementSize();

  return (
    <EditorContext.Provider value={{ size: { width, height } }}>
      <div
        className="relative flex flex-1 flex-col overflow-hidden bg-background text-foreground"
        ref={ref}
      >
        <SnippetStoreProvider snippet={snippetData}>
          <SnippetEditor />
        </SnippetStoreProvider>
      </div>
    </EditorContext.Provider>
  );
}

const SnippetEditor = () => {
  const snippetStore = useContext(SnippetStoreContext);
  if (!snippetStore) {
    throw new Error("SnippetContext.Provider not found in tree.");
  }
  const setSelectedElement = useEditorStore(
    (state) => state.setSelectedElement,
  );
  const viewPortOffset = useEditorStore((state) => state.viewPortOffset);
  const setViewPortOffset = useEditorStore((state) => state.setViewPortOffset);
  const setZoom = useEditorStore((state) => state.setZoom);
  const zoom = useEditorStore((state) => state.zoom);
  const { updateSnippetData } = useSnippetData();

  const handleScroll = useCallback(
    (e: WheelEvent<HTMLDivElement>) => {
      if (e.metaKey) {
        setZoom(Math.min(30, Math.max(0.1, zoom - e.deltaY * 0.01)));
      } else {
        setViewPortOffset({
          x: viewPortOffset.x - e.deltaX,
          y: viewPortOffset.y - e.deltaY,
        });
      }
    },
    [setViewPortOffset, setZoom, viewPortOffset.x, viewPortOffset.y, zoom],
  );

  useEffect(() => {
    const unsub = snippetStore.subscribe((state, prevState) => {
      if (JSON.stringify(state) !== JSON.stringify(prevState)) {
        updateSnippetData(JSON.parse(JSON.stringify(state)));
      }
    });
    return () => {
      unsub();
    };
  }, [snippetStore, updateSnippetData]);

  return (
    <>
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

        <IndecatorsMemo />
      </div>
      <EditorUI />
    </>
  );
};

export const useEditor = () => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error("EditorContext.Provider not found in the tree");
  }
  return context;
};

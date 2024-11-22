"use client";

import {
  createContext,
  CSSProperties,
  useCallback,
  useContext,
  useEffect,
  useRef,
  WheelEvent,
} from "react";
import { z } from "zod";
import { useStore } from "zustand";

import useElementSize from "@/hooks/use-element-size";
import { cn } from "@/lib/utils";
import { iSnippetData } from "@/lib/validator/snippet";
import { createEditorStore, EditorStore } from "@/store/editor-store";
import { createSnippetStore, SnippetStore } from "@/store/snippet-store";

import Canvas from "./canvas";
import EditorUI from "./editor-ui";
import { IndecatorsMemo } from "./indecators";

export type SnippetEditorContextValue = {
  size: {
    width: number;
    height: number;
  };
  readOnly?: boolean;
  store: SnippetStore;
  editorStore: EditorStore;
};

export const SnippetEditorContext =
  createContext<SnippetEditorContextValue | null>(null);

export interface SnippetEditorProps {
  defaultValue: iSnippetData;
  onChnage?: (data: iSnippetData) => void;
  readOnly?: boolean;
  className?: string;
  style?: CSSProperties;
  snippetId?: string;
}

const scrollPosition = z.object({
  scrollX: z.number(),
  scrollY: z.number(),
  zoom: z.number(),
});

const scrollPositionStoreSchema = z.record(scrollPosition);

const SCROLL_POSITIONS_KEY = "codetoimg-scroll-position";

const getScrollPosition = (id: string): z.infer<typeof scrollPosition> => {
  const value = localStorage.getItem(SCROLL_POSITIONS_KEY);
  if (value) {
    const scrollPositions = scrollPositionStoreSchema.parse(JSON.parse(value));
    const scrollPosition = scrollPositions[id];
    if (scrollPosition) {
      return scrollPosition;
    }
  }
  return {
    scrollX: 0,
    scrollY: 0,
    zoom: 1,
  };
};
const setScrollPosition = (id: string, pos: z.infer<typeof scrollPosition>) => {
  let scrollPositions: z.infer<typeof scrollPositionStoreSchema> = {};
  const value = localStorage.getItem(SCROLL_POSITIONS_KEY);
  if (value) {
    scrollPositions = scrollPositionStoreSchema.parse(JSON.parse(value));
  }
  scrollPositions[id] = pos;
  localStorage.setItem(SCROLL_POSITIONS_KEY, JSON.stringify(scrollPositions));
};

export default function SnippetEditor({
  className,
  onChnage,
  readOnly,
  style,
  defaultValue,
  snippetId,
}: SnippetEditorProps) {
  const storeRef = useRef<SnippetStore>();
  if (!storeRef.current) {
    storeRef.current = createSnippetStore(defaultValue);
  }
  const editorStoreRef = useRef<EditorStore>();
  if (!editorStoreRef.current) {
    let scrollPosition = {
      scrollX: 0,
      scrollY: 0,
      zoom: 1,
    };
    if (snippetId) {
      scrollPosition = getScrollPosition(snippetId);
    }
    editorStoreRef.current = createEditorStore({
      ...scrollPosition,
    });
  }

  const { ref, height, width } = useElementSize();
  const setSelectedElement = useStore(
    editorStoreRef.current,
    (state) => state.setSelectedElement,
  );
  const scrollX = useStore(editorStoreRef.current, (state) => state.scrollX);
  const scrollY = useStore(editorStoreRef.current, (state) => state.scrollY);
  const setScroll = useStore(
    editorStoreRef.current,
    (state) => state.setScroll,
  );
  const setZoom = useStore(editorStoreRef.current, (state) => state.setZoom);
  const zoom = useStore(editorStoreRef.current, (state) => state.zoom);

  const handleScroll = useCallback(
    (e: WheelEvent<HTMLDivElement>) => {
      if (e.metaKey) {
        setZoom(Math.min(30, Math.max(0.1, zoom - e.deltaY * 0.01)));
      } else {
        setScroll(scrollX - e.deltaX, scrollY - e.deltaY);
      }
    },
    [setZoom, zoom, setScroll, scrollX, scrollY],
  );

  useEffect(() => {
    if (readOnly) {
      return;
    }
    if (!storeRef.current) {
      return;
    }

    const unsub = storeRef.current.subscribe((state, prevState) => {
      if (JSON.stringify(state) !== JSON.stringify(prevState)) {
        onChnage?.(JSON.parse(JSON.stringify(state)));
      }
    });
    return () => {
      unsub();
    };
  }, [onChnage, readOnly]);

  useEffect(() => {
    if (readOnly || !snippetId) {
      return;
    }
    if (!editorStoreRef.current) {
      return;
    }

    let timeout: NodeJS.Timeout | null = null;

    const unsub = editorStoreRef.current.subscribe((state, prevState) => {
      if (JSON.stringify(state) !== JSON.stringify(prevState)) {
        if (timeout) {
          clearTimeout(timeout);
        }
        timeout = setTimeout(() => {
          setScrollPosition(snippetId, {
            scrollX: state.scrollX,
            scrollY: state.scrollY,
            zoom: state.zoom,
          });
        }, 200);
      }
    });

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
      unsub();
    };
  }, [onChnage, readOnly, snippetId]);

  return (
    <SnippetEditorContext.Provider
      value={{
        size: { width, height },
        store: storeRef.current,
        editorStore: editorStoreRef.current,
        readOnly,
      }}
    >
      <div
        className={cn(
          "relative flex flex-1 flex-col overflow-hidden bg-background text-foreground",
          className,
        )}
        style={style}
        ref={ref}
      >
        <div
          className="absolute bottom-0 left-0 right-0 top-0 overflow-hidden"
          onWheel={handleScroll}
        >
          {!readOnly && (
            <div
              className="absolute inset-0"
              onClick={() => {
                setSelectedElement(null);
              }}
            ></div>
          )}

          <div
            className="absolute left-1/2 top-1/2"
            style={{
              transform: `
                translate(${scrollX}px, ${scrollY}px) 
                scale(${zoom})
              `,
            }}
          >
            <Canvas />
          </div>

          {!readOnly && <IndecatorsMemo />}
        </div>
        <EditorUI />
      </div>
    </SnippetEditorContext.Provider>
  );
}

export const useEditor = () => {
  const context = useContext(SnippetEditorContext);
  if (!context) {
    throw new Error("EditorContext.Provider not found in the tree");
  }
  return context;
};

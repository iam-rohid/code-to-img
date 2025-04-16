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
import { Editor } from "@tiptap/core";
import { z } from "zod";
import { useStore } from "zustand";

import useElementSize from "@/hooks/use-element-size";
import { getEditor } from "@/lib/tiptap";
import { cn } from "@/lib/utils";
import { iSnippetData } from "@/lib/validator/snippet";
import {
  createSnippetEditorStore,
  SnippetEditorStore,
} from "@/store/editor-store";
import { createSnippetStore, SnippetStore } from "@/store/snippet-store";

import Canvas from "./canvas";
import { IndecatorsMemo } from "./indecators";
import SnippetEditorUI from "./snippet-editor-ui";

export type SnippetEditorContextValue = {
  size: {
    width: number;
    height: number;
  };
  readOnly?: boolean;
  snippetStore: SnippetStore;
  editorStore: SnippetEditorStore;
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
  const snippetStoreRef = useRef<SnippetStore>(null);
  if (!snippetStoreRef.current) {
    snippetStoreRef.current = createSnippetStore(defaultValue);
  }
  const editorStoreRef = useRef<SnippetEditorStore>(null);
  if (!editorStoreRef.current) {
    let scrollPosition = {
      scrollX: 0,
      scrollY: 0,
      zoom: 1,
    };
    if (snippetId) {
      scrollPosition = getScrollPosition(snippetId);
    }
    const tipTapEditors: Record<string, Editor> = {};
    defaultValue.elements.forEach((element) => {
      if (element.type === "text") {
        tipTapEditors[element.id] = getEditor(element);
      }
    });
    editorStoreRef.current = createSnippetEditorStore({
      ...scrollPosition,
      tipTapEditors,
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
    if (!snippetStoreRef.current) {
      return;
    }

    const unsub = snippetStoreRef.current.subscribe((state, prevState) => {
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
      if (
        state.scrollX !== prevState.scrollX ||
        state.scrollY !== prevState.scrollY ||
        state.zoom !== prevState.zoom
      ) {
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

  useEffect(() => {
    if (readOnly) {
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!editorStoreRef.current || !snippetStoreRef.current) {
        return;
      }

      const editorStore = editorStoreRef.current.getState();
      const snippetStore = snippetStoreRef.current.getState();

      const element = editorStore.selectedElementId
        ? snippetStore.elements.find(
            (element) => element.id === editorStore.selectedElementId,
          )
        : null;
      if (e.metaKey && e.code === "Equal") {
        e.preventDefault();
        editorStore.setZoom(Math.min(editorStore.zoom + 0.1, 30));
      }
      if (e.metaKey && e.code === "Minus") {
        e.preventDefault();
        editorStore.setZoom(Math.max(editorStore.zoom - 0.1, 0.1));
      }
      if (element) {
        const elementState = editorStore.elementState[element.id];
        if (elementState?.editing) {
          return;
        }

        if (e.code === "Backspace") {
          e.preventDefault();
          snippetStore.removeElement(element.id);
          return;
        }
        if (e.code === "ArrowUp") {
          e.preventDefault();
          const incrementBy = e.shiftKey ? 10 : 1;
          snippetStore.updateElement(element.id, {
            y: element.y - incrementBy,
          });
        }
        if (e.code === "ArrowDown") {
          e.preventDefault();
          const incrementBy = e.shiftKey ? 10 : 1;
          snippetStore.updateElement(element.id, {
            y: element.y + incrementBy,
          });
        }
        if (e.code === "ArrowLeft") {
          e.preventDefault();
          const incrementBy = e.shiftKey ? 10 : 1;
          snippetStore.updateElement(element.id, {
            x: element.x - incrementBy,
          });
        }
        if (e.code === "ArrowRight") {
          e.preventDefault();
          const incrementBy = e.shiftKey ? 10 : 1;
          snippetStore.updateElement(element.id, {
            x: element.x + incrementBy,
          });
        }
        if (e.code === "ArrowRight") {
          e.preventDefault();
          const incrementBy = e.shiftKey ? 10 : 1;
          snippetStore.updateElement(element.id, {
            x: element.x + incrementBy,
          });
        }
        if (e.metaKey && e.code === "KeyD") {
          e.preventDefault();
          const duplicatedElement = snippetStore.duplicateElement(element.id);
          if (duplicatedElement) {
            if (duplicatedElement.type === "text") {
              editorStore.setTipTapEditor(
                duplicatedElement.id,
                getEditor(duplicatedElement),
              );
            }
            editorStore.setSelectedElement(duplicatedElement.id);
          }
        }
        if (e.code === "BracketRight") {
          e.preventDefault();
          snippetStore.bringToFront(element.id, !e.metaKey);
        }
        if (e.code === "BracketLeft") {
          e.preventDefault();
          snippetStore.sendToBack(element.id, !e.metaKey);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [readOnly]);

  return (
    <SnippetEditorContext.Provider
      value={{
        size: { width, height },
        snippetStore: snippetStoreRef.current,
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
        <SnippetEditorUI />
      </div>
    </SnippetEditorContext.Provider>
  );
}

export const useSnippetEditor = () => {
  const context = useContext(SnippetEditorContext);
  if (!context) {
    throw new Error("EditorContext.Provider not found in the tree");
  }
  return context;
};

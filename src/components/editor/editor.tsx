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

import useElementSize from "@/hooks/use-element-size";
import { cn } from "@/lib/utils";
import { iSnippetData } from "@/lib/validator/snippet";
import { useEditorStore } from "@/store/editor-store";
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
};

export const SnippetEditorContext =
  createContext<SnippetEditorContextValue | null>(null);

export interface SnippetEditorProps {
  defaultValue: iSnippetData;
  onChnage?: (data: iSnippetData) => void;
  readOnly?: boolean;
  className?: string;
  style?: CSSProperties;
}

export default function SnippetEditor({
  className,
  onChnage,
  readOnly,
  style,
  defaultValue,
}: SnippetEditorProps) {
  const { ref, height, width } = useElementSize();
  const storeRef = useRef<SnippetStore>();
  const setSelectedElement = useEditorStore(
    (state) => state.setSelectedElement,
  );
  const viewPortOffset = useEditorStore((state) => state.viewPortOffset);
  const setViewPortOffset = useEditorStore((state) => state.setViewPortOffset);
  const setZoom = useEditorStore((state) => state.setZoom);
  const zoom = useEditorStore((state) => state.zoom);

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

  if (!storeRef.current) {
    storeRef.current = createSnippetStore(defaultValue);
  }

  useEffect(() => {
    if (!storeRef.current) {
      return;
    }
    if (readOnly) {
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

  return (
    <SnippetEditorContext.Provider
      value={{
        size: { width, height },
        store: storeRef.current,
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
                translate(${viewPortOffset.x}px, ${viewPortOffset.y}px) 
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

// const Editor = () => {
//   const snippetStore = useContext(SnippetStoreContext);
//   if (!snippetStore) {
//     throw new Error("SnippetContext.Provider not found in tree.");
//   }
//   const setSelectedElement = useEditorStore(
//     (state) => state.setSelectedElement,
//   );
//   const viewPortOffset = useEditorStore((state) => state.viewPortOffset);
//   const setViewPortOffset = useEditorStore((state) => state.setViewPortOffset);
//   const setZoom = useEditorStore((state) => state.setZoom);
//   const zoom = useEditorStore((state) => state.zoom);
//   const { updateSnippetData } = useSnippetData();

//   const handleScroll = useCallback(
//     (e: WheelEvent<HTMLDivElement>) => {
//       if (e.metaKey) {
//         setZoom(Math.min(30, Math.max(0.1, zoom - e.deltaY * 0.01)));
//       } else {
//         setViewPortOffset({
//           x: viewPortOffset.x - e.deltaX,
//           y: viewPortOffset.y - e.deltaY,
//         });
//       }
//     },
//     [setViewPortOffset, setZoom, viewPortOffset.x, viewPortOffset.y, zoom],
//   );

//   useEffect(() => {
//     const unsub = snippetStore.subscribe((state, prevState) => {
//       if (JSON.stringify(state) !== JSON.stringify(prevState)) {
//         updateSnippetData(JSON.parse(JSON.stringify(state)));
//       }
//     });
//     return () => {
//       unsub();
//     };
//   }, [snippetStore, updateSnippetData]);

//   return (
//     <>
//       <div
//         className="absolute bottom-0 left-0 right-0 top-0 overflow-hidden"
//         onWheel={handleScroll}
//       >
//         <div
//           className="absolute inset-0"
//           onClick={() => setSelectedElement(null)}
//         ></div>

//         <div
//           className="absolute left-1/2 top-1/2"
//           style={{
//             transform: `
//           translate(${viewPortOffset.x}px, ${viewPortOffset.y}px)
//           scale(${zoom})
//         `,
//           }}
//         >
//           <Canvas />
//         </div>

//         <IndecatorsMemo />
//       </div>
//       <EditorUI />
//     </>
//   );
// };

export const useEditor = () => {
  const context = useContext(SnippetEditorContext);
  if (!context) {
    throw new Error("EditorContext.Provider not found in the tree");
  }
  return context;
};

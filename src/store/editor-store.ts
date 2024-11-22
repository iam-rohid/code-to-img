import { create } from "zustand";

import { SnippetState } from "./snippet-store";

export interface ElementState {
  hovering?: boolean;
  dragging?: boolean;
  resizing?: boolean;
  rotating?: boolean;
}

export interface EditorState {
  history: SnippetState[];
  historyIndex: number;
  elementState: Record<string, ElementState>;
  selectedElementId: string | null;
  zoom: number;
  scrollX: number;
  scrollY: number;
  layersOpen: boolean;
}

export interface EditorActions {
  setZoom: (zoom: EditorState["zoom"]) => void;
  setScroll: (scrollX: number, scrollY: number) => void;
  setScrollY: (scrollX: number) => void;
  setScrollX: (scrollY: number) => void;
  setLayersOpen: (open: boolean) => void;
  setSelectedElement: (elemenntId: EditorState["selectedElementId"]) => void;
  updateElementState: (elemenntId: string, data: Partial<ElementState>) => void;
  commitHistory: (state: SnippetState) => void;
  undo: () => void;
  redo: () => void;
}

export const createEditorStore = (initElementState: Partial<EditorState>) => {
  return create<EditorState & EditorActions>()((set) => ({
    history: [],
    historyIndex: -1,
    zoom: 1,
    scrollX: 0,
    scrollY: 0,
    elementState: {},
    selectedElementId: null,
    layersOpen: false,
    ...initElementState,
    setLayersOpen: (layersOpen) => set({ layersOpen }),
    setZoom: (zoom) => set({ zoom }),
    setScroll: (scrollX, scrollY) => set({ scrollX, scrollY }),
    setScrollX: (scrollX) => set({ scrollX }),
    setScrollY: (scrollY) => set({ scrollY }),
    updateElementState: (elementId, data) => {
      set((state) => {
        const stateToUpdate = state.elementState[elementId] ?? {};
        return {
          elementState: {
            ...state.elementState,
            [elementId]: { ...stateToUpdate, ...data },
          },
        };
      });
    },
    setSelectedElement: (elementId) => set({ selectedElementId: elementId }),
    commitHistory: (snippetState) => {
      set((state) => ({
        history: [...state.history.slice(0, state.historyIndex), snippetState],
        historyIndex: state.historyIndex + 1,
      }));
    },
    undo: () => {
      set((state) => ({
        historyIndex: Math.max(0, state.historyIndex - 1),
      }));
    },
    redo: () => {
      set((state) => ({
        historyIndex: Math.min(
          state.history.length - 1,
          state.historyIndex + 1,
        ),
      }));
    },
  }));
};

export type EditorStore = ReturnType<typeof createEditorStore>;

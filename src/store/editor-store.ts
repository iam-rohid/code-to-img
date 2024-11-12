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
  layersOpen: boolean;
  viewPortOffset: {
    x: number;
    y: number;
  };
}

export interface EditorActions {
  setZoom: (zoom: EditorState["zoom"]) => void;
  setViewPortOffset: (offset: EditorState["viewPortOffset"]) => void;
  setLayersOpen: (open: boolean) => void;
  setSelectedElement: (elemenntId: EditorState["selectedElementId"]) => void;
  updateElementState: (elemenntId: string, data: Partial<ElementState>) => void;
  commitHistory: (state: SnippetState) => void;
  undo: () => void;
  redo: () => void;
}

export type EditorStore = EditorState & EditorActions;

export const useEditorStore = create<EditorStore>()((set) => ({
  history: [],
  historyIndex: -1,
  zoom: 1,
  viewPortOffset: {
    x: 0,
    y: 0,
  },
  elementState: {},
  selectedElementId: null,
  layersOpen: false,
  setLayersOpen: (layersOpen) => set({ layersOpen }),
  setZoom: (zoom) => set({ zoom }),
  setViewPortOffset: (viewPortOffset) => set({ viewPortOffset }),
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
      historyIndex: Math.min(state.history.length - 1, state.historyIndex + 1),
    }));
  },
}));

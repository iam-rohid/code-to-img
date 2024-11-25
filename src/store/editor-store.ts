import { create } from "zustand";

import { SnippetState } from "./snippet-store";

export interface ElementState {
  hovering?: boolean;
  dragging?: boolean;
  resizing?: boolean;
  rotating?: boolean;
}

export interface SnippetEditorState {
  history: SnippetState[];
  historyIndex: number;
  elementState: Record<string, ElementState>;
  selectedElementId: string | null;
  zoom: number;
  scrollX: number;
  scrollY: number;
  layersOpen: boolean;
  selectedTabIds: Record<string, string>;
}

export interface SnippetEditorActions {
  setZoom: (zoom: SnippetEditorState["zoom"]) => void;
  setScroll: (scrollX: number, scrollY: number) => void;
  setScrollY: (scrollX: number) => void;
  setScrollX: (scrollY: number) => void;
  setLayersOpen: (open: boolean) => void;
  setSelectedElement: (elemenntId: string | null) => void;
  handleTabSelect: (elementId: string, tabId: string) => void;
  updateElementState: (elemenntId: string, data: Partial<ElementState>) => void;
  commitHistory: (state: SnippetState) => void;
  undo: () => void;
  redo: () => void;
}

export const createSnippetEditorStore = (
  initState: Partial<SnippetEditorState>,
) => {
  return create<SnippetEditorState & SnippetEditorActions>()((set) => ({
    history: [],
    historyIndex: -1,
    zoom: 1,
    scrollX: 0,
    scrollY: 0,
    elementState: {},
    selectedElementId: null,
    layersOpen: false,
    selectedTabIds: {},
    ...initState,
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
    handleTabSelect: (elementId, tabId) =>
      set((state) => ({
        selectedTabIds: { ...state.selectedTabIds, [elementId]: tabId },
      })),
  }));
};

export type SnippetEditorStore = ReturnType<typeof createSnippetEditorStore>;

import { nanoid } from "nanoid";
import { create } from "zustand";

import { getCodeEditorElement } from "@/lib/utils/editor";
import { iElement } from "@/lib/validator/element";
import { iSnippetData } from "@/lib/validator/snippet";
import { iTransform } from "@/lib/validator/transform";

export type Alignment =
  | "start-horizontal"
  | "center-horizontal"
  | "end-horizontal"
  | "start-vertical"
  | "center-vertical"
  | "end-vertical";

export type SnipetActions = {
  updateSnippet: (snippet: Partial<iSnippetData>) => void;
  updateSnippetTransform: (transform: Partial<iTransform>) => void;
  addElement: (element: iElement) => void;
  updateElement: (elementId: string, data: Partial<iElement>) => void;
  updateElementTransform: (
    elementId: string,
    transform: Partial<iTransform>,
  ) => void;
  removeElement: (elemenntId: string) => void;
  duplicateElement: (elemenntId: string) => void;
  alignElement: (elementId: string, alignment: Alignment) => void;
};

export const defaultSnippetState: iSnippetData = {
  transform: {
    width: 600,
    height: 400,
    widthHeightLinked: false,
    position: {
      x: 0,
      y: 0,
    },
    rotation: 0,
    scale: 1,
  },
  background: {
    color: {
      type: "gradient",
      colors: ["#3B41C5FF", "#A981BBFF", "#CA62FAFF", "#FFC8A9FF"],
      angle: 147,
    },
  },
  elements: [getCodeEditorElement(600, 400)],
};

export type SnippetState = iSnippetData & SnipetActions;

export type SnippetStore = ReturnType<typeof createSnippetStore>;

export const createSnippetStore = (initProps?: Partial<iSnippetData>) => {
  return create<SnippetState>()((set, get) => ({
    ...defaultSnippetState,
    ...initProps,
    updateSnippet: (data) => {
      set({ ...data });
    },
    addElement: (element) => {
      set((state) => ({
        elements: [element, ...state.elements],
      }));
    },
    updateElement: (elementId, data) => {
      set((state) => ({
        elements: state.elements.map((el) =>
          el.id === elementId ? ({ ...el, ...data } as iElement) : el,
        ),
      }));
    },
    updateSnippetTransform: (transform) => {
      set((state) => ({
        transform: {
          ...state.transform,
          ...transform,
        },
      }));
    },
    updateElementTransform: (elementId, transform) => {
      set((state) => ({
        elements: state.elements.map((el) =>
          el.id === elementId
            ? { ...el, transform: { ...el.transform, ...transform } }
            : el,
        ),
      }));
    },
    removeElement: (elementId) => {
      set((state) => ({
        elements: state.elements.filter((el) => el.id !== elementId),
      }));
    },
    duplicateElement: (elementId) => {
      const snippets = get().elements;
      const elementToDuplicate = snippets.find((el) => el.id === elementId);
      if (!elementToDuplicate) {
        return;
      }

      const element = structuredClone(elementToDuplicate);
      element.id = nanoid();
      element.transform.position.x += 10;
      element.transform.position.y += 10;

      set({
        elements: [element, ...snippets],
      });
    },
    alignElement: (elementId, alignment) => {
      const state = get();
      const transform = state.elements.find(
        (element) => element.id === elementId,
      )?.transform;
      if (!transform) {
        return;
      }

      let x = transform.position.x;
      let y = transform.position.y;

      switch (alignment) {
        case "start-horizontal":
          x = 0;
          break;
        case "center-horizontal":
          x =
            state.transform.width / 2 - (transform.width * transform.scale) / 2;
          break;
        case "end-horizontal":
          x = state.transform.width - transform.width * transform.scale;
          break;
        case "start-vertical":
          y = 0;
          break;
        case "center-vertical":
          y =
            state.transform.height / 2 -
            (transform.height * transform.scale) / 2;
          break;
        case "end-vertical":
          y = state.transform.height - transform.height * transform.scale;
          break;
      }

      set({
        elements: state.elements.map((element) =>
          element.id === elementId
            ? {
                ...element,
                transform: { ...element.transform, position: { x, y } },
              }
            : element,
        ),
      });
    },
  }));
};

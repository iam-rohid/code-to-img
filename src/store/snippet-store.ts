import { nanoid } from "nanoid";
import { create } from "zustand";

import { elementSchema, iElement } from "@/lib/validator/elements";
import { iSnippetData, snippetSchema } from "@/lib/validator/snippet";

export type Alignment =
  | "start-horizontal"
  | "center-horizontal"
  | "end-horizontal"
  | "start-vertical"
  | "center-vertical"
  | "end-vertical";

export type SnipetActions = {
  updateSnippet: (snippet: Partial<iSnippetData>) => void;
  // updateSnippetTransform: (transform: Partial<Snip>) => void;
  addElement: (element: iElement) => void;
  updateElement: (elementId: string, data: Partial<iElement>) => void;
  bringToFront: (elementId: string, allTheWayFront?: boolean) => void;
  sendToBack: (elementId: string, allTheWayFront?: boolean) => void;
  // updateElementTransform: (
  //   elementId: string,
  //   transform: Partial<iTransform>,
  // ) => void;
  removeElement: (elemenntId: string) => void;
  duplicateElement: (elemenntId: string) => iElement | null;
  alignElement: (elementId: string, alignment: Alignment) => void;
};

export type SnippetState = iSnippetData & SnipetActions;

export type SnippetStore = ReturnType<typeof createSnippetStore>;

export const createSnippetStore = (snippetData: iSnippetData) => {
  return create<SnippetState>()((set, get) => ({
    ...snippetSchema.parse(snippetData),
    updateSnippet: (data) => {
      set({ ...data });
    },
    addElement: (element) => {
      const el = elementSchema.parse(element);
      set((state) => ({
        elements: [el, ...state.elements],
      }));
    },
    updateElement: (elementId, data) => {
      set((state) => ({
        elements: state.elements.map((el) =>
          el.id === elementId ? ({ ...el, ...data } as iElement) : el,
        ),
      }));
    },
    // updateSnippetTransform: (transform) => {
    //   set((state) => ({
    //     transform: {
    //       ...state.transform,
    //       ...transform,
    //     },
    //   }));
    // },
    // updateElementTransform: (elementId, transform) => {
    //   set((state) => ({
    //     elements: state.elements.map((el) =>
    //       el.id === elementId
    //         ? { ...el, transform: { ...el.transform, ...transform } }
    //         : el,
    //     ),
    //   }));
    // },
    removeElement: (elementId) => {
      set((state) => ({
        elements: state.elements.filter((el) => el.id !== elementId),
      }));
    },
    duplicateElement: (elementId) => {
      const snippets = get().elements;
      const elementToDuplicate = snippets.find((el) => el.id === elementId);
      if (!elementToDuplicate) {
        return null;
      }

      const element = structuredClone(elementToDuplicate);
      element.id = nanoid();
      element.x += 10;
      element.y += 10;

      set({
        elements: [element, ...snippets],
      });
      return element;
    },
    alignElement: (elementId, alignment) => {
      const state = get();
      const element = state.elements.find(
        (element) => element.id === elementId,
      );
      if (!element) {
        return;
      }

      let x = element.x;
      let y = element.y;

      switch (alignment) {
        case "start-horizontal":
          x = 0;
          break;
        case "center-horizontal":
          x = state.width / 2 - (element.width * element.scale) / 2;
          break;
        case "end-horizontal":
          x = state.width - element.width * element.scale;
          break;
        case "start-vertical":
          y = 0;
          break;
        case "center-vertical":
          y = state.height / 2 - (element.height * element.scale) / 2;
          break;
        case "end-vertical":
          y = state.height - element.height * element.scale;
          break;
      }

      set({
        elements: state.elements.map((element) =>
          element.id === elementId ? { ...element, x, y } : element,
        ),
      });
    },
    sendToBack: (elementId, allTheWayBack) => {
      const elements = get().elements;
      const elementIndex = elements.findIndex((el) => el.id === elementId);
      const element = elements.find((el) => el.id === elementId);

      if (elementIndex >= elements.length - 1 || !element) {
        return;
      }
      let newList = structuredClone(elements);
      if (allTheWayBack) {
        newList = [...newList.filter((el) => el.id !== element.id), element];
      } else {
        newList[elementIndex] = newList[elementIndex + 1];
        newList[elementIndex + 1] = element;
      }
      set({ elements: newList });
    },
    bringToFront: (elementId, allTheWayFront) => {
      const elements = get().elements;
      const elementIndex = elements.findIndex((el) => el.id === elementId);
      const element = elements.find((el) => el.id === elementId);

      if (elementIndex <= 0 || !element) {
        return;
      }

      let newList = structuredClone(elements);
      if (allTheWayFront) {
        newList = [element, ...newList.filter((el) => el.id !== elementId)];
      } else {
        newList[elementIndex] = newList[elementIndex - 1];
        newList[elementIndex - 1] = element;
      }
      set({ elements: newList });
    },
  }));
};

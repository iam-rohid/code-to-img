import { getCodeEditorElement } from "@/editor/utils";
import { create } from "zustand";
import { EditorStore } from "./types";
import { nanoid } from "nanoid";

export const useEditorStore = create<EditorStore>()((set, get) => ({
  canvas: {
    width: 600,
    height: 400,
    widthHeightLinked: false,
    background: {
      color: {
        type: "gradient",
        colors: ["#3B41C5FF", "#A981BBFF", "#CA62FAFF", "#FFC8A9FF"],
        angle: 147,
      },
    },
    elements: [getCodeEditorElement(600, 400)],
  },
  zoom: 1,
  viewPortOffset: {
    x: 0,
    y: 0,
  },
  elementState: {},
  selectedElementId: null,
  layersOpen: false,
  setLayersOpen: (layersOpen) => set({ layersOpen }),
  setCanvas: (updatedCanvas) => {
    const canvas = get().canvas;
    set({ canvas: { ...canvas, ...updatedCanvas } });
  },
  setZoom: (zoom) => set({ zoom }),
  setViewPortOffset: (viewPortOffset) => set({ viewPortOffset }),
  addElement: (element) => {
    set((state) => ({
      selectedElementId: element.id,
      canvas: {
        ...state.canvas,
        elements: [element, ...state.canvas.elements],
      },
    }));
  },
  updateElement: (updatedElement) => {
    const canvas = get().canvas;
    set({
      canvas: {
        ...canvas,
        elements: canvas.elements.map((el) =>
          el.id === updatedElement.id ? updatedElement : el,
        ),
      },
    });
  },
  updateElementTransform: (elementId, transform) => {
    set((state) => ({
      canvas: {
        ...state.canvas,
        elements: state.canvas.elements.map((el) =>
          el.id === elementId
            ? { ...el, transform: { ...el.transform, ...transform } }
            : el,
        ),
      },
    }));
  },
  updateElementState: (elementId, state) => {
    const elementState = get().elementState;
    const stateToUpdate = elementState[elementId] ?? {};
    set({
      elementState: {
        ...elementState,
        [elementId]: { ...stateToUpdate, ...state },
      },
    });
  },
  removeElement: (elementId) => {
    const canvas = get().canvas;
    set({
      canvas: {
        ...canvas,
        elements: canvas.elements.filter((el) => el.id !== elementId),
      },
    });
  },
  duplicateElement: (elementId) => {
    const canvas = get().canvas;
    const elementToDuplicate = canvas.elements.find(
      (el) => el.id === elementId,
    );
    if (!elementToDuplicate) {
      return;
    }

    const element = structuredClone(elementToDuplicate);
    element.id = nanoid();
    element.transform.position.x += 10;
    element.transform.position.y += 10;

    set({
      selectedElementId: element.id,
      canvas: {
        ...canvas,
        elements: [element, ...canvas.elements],
      },
    });
  },
  setSelectedElement: (elementId) => set({ selectedElementId: elementId }),
  alignElement: (elementId, alignment) => {
    const canvas = get().canvas;
    const transform = canvas.elements.find(
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
        x = canvas.width / 2 - (transform.width * transform.scale) / 2;
        break;
      case "end-horizontal":
        x = canvas.width - transform.width * transform.scale;
        break;
      case "start-vertical":
        y = 0;
        break;
      case "center-vertical":
        y = canvas.height / 2 - (transform.height * transform.scale) / 2;
        break;
      case "end-vertical":
        y = canvas.height - transform.height * transform.scale;
        break;
    }

    set({
      canvas: {
        ...canvas,
        elements: canvas.elements.map((element) =>
          element.id === elementId
            ? {
                ...element,
                transform: { ...element.transform, position: { x, y } },
              }
            : element,
        ),
      },
    });
  },
}));

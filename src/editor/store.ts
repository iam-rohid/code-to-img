import { getCodeEditorElement } from "@/editor/utils";
import { create } from "zustand";
import { EditorStore } from "./types";
import { nanoid } from "nanoid";

export const useEditorStore = create<EditorStore>()((set, get) => ({
  canvas: {
    width: 600,
    height: 400,
    widthHeightLinked: false,
    elements: [getCodeEditorElement(600, 400)],
  },
  zoom: 1,
  elementState: {},
  selectedElementId: null,
  setCanvas: (updatedCanvas) => {
    const canvas = get().canvas;
    set({ canvas: { ...canvas, ...updatedCanvas } });
  },
  setZoom: (zoom) => set({ zoom }),
  addElement: (element) => {
    const canvas = get().canvas;
    set({ canvas: { ...canvas, elements: [...canvas.elements, element] } });
  },
  updateElement: (elementId, dto) => {
    const canvas = get().canvas;
    set({
      canvas: {
        ...canvas,
        elements: canvas.elements.map((el) =>
          el.id === elementId
            ? {
                ...el,
                ...dto,
                transform: { ...el.transform, ...dto.transform },
              }
            : el,
        ),
      },
    });
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
        elements: [...canvas.elements, element],
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

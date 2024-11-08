import { nanoid } from "nanoid";
import { create } from "zustand";

export interface iCodeEditorElement {
  type: "code-editor";
}

export interface iElement extends iCodeEditorElement {
  id: string;
  name: string;
  width: number;
  height: number;
  minWidth: number;
  minHeight: number;
  widthHeightLinked: boolean;
  rotation: number;
  scale: number;
  position: {
    x: number;
    y: number;
  };
  positionConstraints: {
    x: "left" | "center" | "right";
    y: "left" | "center" | "right";
  };
}

export interface iCanvas {
  width: number;
  height: number;
  elements: iElement[];
}

interface ElementState {
  hovering: boolean;
}

export interface EditorState {
  canvas: iCanvas;
  elementState: Record<string, ElementState>;
  selectedElementId: string | null;
  zoom: number;
}

export type Alignment =
  | "start-horizontal"
  | "center-horizontal"
  | "end-horizontal"
  | "start-vertical"
  | "center-vertical"
  | "end-vertical";

export interface EditorActions {
  setCanvas: (canvas: EditorState["canvas"]) => void;
  setZoom: (zoom: EditorState["zoom"]) => void;
  addElement: (element: iElement) => void;
  setElement: (element: iElement) => void;
  updateElementState: (elementId: string, state: ElementState) => void;
  setSelectedElement: (elemenntId: string) => void;
  alignElement: (elementId: string, alignment: Alignment) => void;
}

export type EditorStore = EditorState & EditorActions;

export const useEditorStore = create<EditorStore>()((set, get) => ({
  canvas: {
    width: 600,
    height: 400,
    elements: [
      {
        type: "code-editor",
        id: nanoid(),
        height: 200,
        width: 400,
        minHeight: 100,
        minWidth: 100,
        widthHeightLinked: false,
        name: "Code Editor",
        position: { x: 0, y: 0 },
        positionConstraints: { x: "center", y: "center" },
        rotation: 0,
        scale: 1,
      },
    ],
  },
  zoom: 1,
  elementState: {},
  selectedElementId: null,
  setCanvas: (canvas) => set({ canvas }),
  setZoom: (zoom) => set({ zoom }),
  addElement: (element) => {
    const canvas = get().canvas;
    set({ canvas: { ...canvas, elements: [...canvas.elements, element] } });
  },
  setElement: (element) => {
    const canvas = get().canvas;
    set({
      canvas: {
        ...canvas,
        elements: canvas.elements.map((el) =>
          el.id === element.id ? element : el,
        ),
      },
    });
  },
  updateElementState: (elementId, state) => {
    const elementState = get().elementState;
    set({ elementState: { ...elementState, [elementId]: state } });
  },
  setSelectedElement: (elementId) => set({ selectedElementId: elementId }),
  alignElement: (elementId, alignment) => {
    const canvas = get().canvas;
    const element = canvas.elements.find((element) => element.id === elementId);
    if (!element) {
      return;
    }

    let x = element.position.x;
    let y = element.position.y;

    switch (alignment) {
      case "start-horizontal":
        x = 0;
        break;
      case "center-horizontal":
        x = canvas.width / 2 - (element.width * element.scale) / 2;
        break;
      case "end-horizontal":
        x = canvas.width - element.width * element.scale;
        break;
      case "start-vertical":
        y = 0;
        break;
      case "center-vertical":
        y = canvas.height / 2 - (element.height * element.scale) / 2;
        break;
      case "end-vertical":
        y = canvas.height - element.height * element.scale;
        break;
    }

    set({
      canvas: {
        ...canvas,
        elements: canvas.elements.map((element) =>
          element.id === elementId
            ? { ...element, position: { x, y } }
            : element,
        ),
      },
    });
  },
}));

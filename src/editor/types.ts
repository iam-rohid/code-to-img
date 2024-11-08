export interface iCodeEditorElement {
  type: "code-editor";
}

export interface iElementTransform {
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
}

export interface iElement extends iCodeEditorElement {
  id: string;
  name: string;
  transform: iElementTransform;
}

export interface iCanvas {
  width: number;
  height: number;
  widthHeightLinked: boolean;
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
  setCanvas: (canvas: Partial<EditorState["canvas"]>) => void;
  setZoom: (zoom: EditorState["zoom"]) => void;
  addElement: (element: iElement) => void;
  updateElement: (
    elementId: string,
    dto: Partial<Omit<iElement, "id">>,
  ) => void;
  updateElementState: (elementId: string, state: Partial<ElementState>) => void;
  setSelectedElement: (elemenntId: EditorState["selectedElementId"]) => void;
  removeElement: (elemenntId: string) => void;
  duplicateElement: (elemenntId: string) => void;
  alignElement: (elementId: string, alignment: Alignment) => void;
}

export type EditorStore = EditorState & EditorActions;

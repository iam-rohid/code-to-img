export interface iCodeEditorElement {
  type: "code-editor";
}
export interface iTextElement {
  type: "text";
  value: string;
  textAlign?: "start" | "center" | "end";
  color?: string;
  backgroundColor?: string;
  fontSize?: number;
  fontWeight?: string;
  fontFamily?: string;
  letterSpacing?: number;
  lineHeight?: number;
  padding?: number;
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

export type iElement = (iCodeEditorElement | iTextElement) & {
  id: string;
  name: string;
  transform: iElementTransform;
  hidden?: boolean;
  locked?: boolean;
};

export interface iSolidColor {
  type: "solid";
  color: string;
}
export interface iLinearGradientColor {
  type: "gradient";
  colors: string[];
  angle: number;
}

export type iColor = iSolidColor | iLinearGradientColor;

export interface iBackground {
  color?: iColor | null;
  image?: string | null;
}

export interface iCanvas {
  width: number;
  height: number;
  widthHeightLinked: boolean;
  background: iBackground;
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
  layersOpen: boolean;
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
  setLayersOpen: (open: boolean) => void;
  addElement: (element: iElement) => void;
  updateElement: (dto: iElement) => void;
  updateElementState: (elementId: string, state: Partial<ElementState>) => void;
  setSelectedElement: (elemenntId: EditorState["selectedElementId"]) => void;
  removeElement: (elemenntId: string) => void;
  duplicateElement: (elemenntId: string) => void;
  alignElement: (elementId: string, alignment: Alignment) => void;
}

export type EditorStore = EditorState & EditorActions;

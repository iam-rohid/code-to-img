import { LanguageName } from "@uiw/codemirror-extensions-langs";

export interface iPadding {
  left: number;
  right: number;
  bottom: number;
  top: number;
  horizontalLinked?: boolean;
  verticalLinked?: boolean;
}

export interface iCodeEditorElement {
  type: "code-editor";
  code: string;
  fontSize: number;
  lineHeight: number;
  lineNumbers: boolean;
  language: LanguageName;
  theme: string;
  padding: iPadding;
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
  autoWidth?: boolean;
  autoHeight?: boolean;
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
  hovering?: boolean;
  dragging?: boolean;
  resizing?: boolean;
  rotating?: boolean;
}

export interface EditorState {
  canvas: iCanvas;
  elementState: Record<string, ElementState>;
  selectedElementId: string | null;
  zoom: number;
  layersOpen: boolean;
  viewPortOffset: {
    x: number;
    y: number;
  };
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
  setViewPortOffset: (offset: EditorState["viewPortOffset"]) => void;
  setLayersOpen: (open: boolean) => void;
  addElement: (element: iElement) => void;
  updateElement: (dto: iElement) => void;
  updateElementTransform: (
    elementId: string,
    dto: Partial<iElementTransform>,
  ) => void;
  updateElementState: (elementId: string, state: Partial<ElementState>) => void;
  setSelectedElement: (elemenntId: EditorState["selectedElementId"]) => void;
  removeElement: (elemenntId: string) => void;
  duplicateElement: (elemenntId: string) => void;
  alignElement: (elementId: string, alignment: Alignment) => void;
}

export type EditorStore = EditorState & EditorActions;

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

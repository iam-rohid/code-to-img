import { iCodeEditorElement, iTextElement } from "../validator/element";

export interface GetElementArgs {
  id: string;
  canvasWidth: number;
  canvasHeight: number;
  name?: string;
  width?: number;
  height?: number;
}

export interface GetCodeEditorElementProps extends GetElementArgs {
  theme?: string;
}

export const getCodeEditorElement = ({
  id,
  canvasHeight,
  canvasWidth,
  width = 400,
  height = 93,
  name = "Code Editor",
  theme = "theme-1",
}: GetCodeEditorElementProps): iCodeEditorElement => ({
  id,
  name,
  transform: {
    height,
    width,
    autoWidth: false,
    autoHeight: true,
    widthHeightLinked: false,
    position: {
      x: canvasWidth / 2 - width / 2,
      y: canvasHeight / 2 - height / 2,
    },
    rotation: 0,
    scale: 1,
  },
  type: "code-editor",
  code: 'console.log("Hello, World")',
  fontSize: 16,
  language: "javascript",
  lineHeight: 24,
  showLineNumbers: true,
  theme,
  padding: {
    top: 0,
    left: 12,
    right: 12,
    bottom: 12,
  },
  lineNumbersStartFrom: 1,
  tabSize: 4,
  showTitleBar: true,
  titleBarControlStyle: "macos-default",
  titleBarControlPosition: "left",
  hidden: false,
  locked: false,
});

export interface GetTextElementProps extends GetElementArgs {
  text?: string;
}

export const getTextElement = ({
  id,
  canvasHeight,
  canvasWidth,
  width = 72,
  height = 44,
  name = "Text",
  text = "Text",
}: GetTextElementProps): iTextElement => ({
  id,
  type: "text",
  name,
  text,
  foregrounnd: "#000",
  background: { color: { type: "solid", color: "#FFFFFF" } },
  fontWeight: "900",
  lineHeight: 1,
  fontSize: 24,
  transform: {
    height,
    width,
    autoHeight: true,
    autoWidth: true,
    widthHeightLinked: false,
    position: {
      x: canvasWidth / 2 - width / 2,
      y: canvasHeight / 2 - height / 2,
    },
    rotation: 0,
    scale: 1,
  },
  fontFamily: "Inter",
  padding: {
    bottom: 8,
    left: 8,
    right: 8,
    top: 8,
  },
  horizontalAlignment: "center",
  verticalAlignment: "center",
  letterSpacing: 1,
});

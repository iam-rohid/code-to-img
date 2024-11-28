import { nanoid } from "nanoid";

import { iCodeEditorElement, iTextElement } from "../validator/elements";

import { DEFAULT_THEME } from "./code-editor-themes";

export interface GetElementArgs {
  id: string;
  name?: string;
  width?: number;
  height?: number;
  x?: number;
  y?: number;
}

export interface GetCodeEditorElementProps extends GetElementArgs {
  theme?: string;
}

export const CURRENT_CODE_EDITOR_ELEMENT_VERSION = "0.1.0";
export const getCodeEditorElement = ({
  id,
  width = 400,
  height = 93,
  name = "Code Editor",
  theme = DEFAULT_THEME,
  x = 0,
  y = 0,
}: GetCodeEditorElementProps): iCodeEditorElement => ({
  version: CURRENT_CODE_EDITOR_ELEMENT_VERSION,
  type: "code-editor",
  id,
  name,
  height,
  width,
  x,
  y,
  theme,
  autoWidth: false,
  autoHeight: true,
  widthHeightLinked: false,
  rotation: 0,
  scale: 1,
  fontSize: 16,
  lineHeight: 24,
  showLineNumbers: true,
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
  showTabs: true,
  tabs: [
    {
      id: nanoid(),
      name: "Tab 01",
      code: 'console.log("Hello, World")',
      language: "javascript",
    },
  ],
});

export interface GetTextElementProps extends GetElementArgs {
  text?: string;
}
const CURRENT_TEXT_ELEMENT_VERSION = "0.1.0";

export const getTextElement = ({
  id,
  width = 72,
  height = 44,
  name = "Text",
  text = "Text",
  x = 0,
  y = 0,
}: GetTextElementProps): iTextElement => ({
  version: CURRENT_TEXT_ELEMENT_VERSION,
  type: "text",
  id,
  name,
  text,
  x,
  y,
  height,
  width,
  foregrounnd: "#000",
  background: { color: { type: "solid", color: "#FFFFFF" } },
  fontWeight: "900",
  lineHeight: 1,
  fontSize: 24,
  autoHeight: true,
  autoWidth: true,
  widthHeightLinked: false,
  rotation: 0,
  scale: 1,
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
  hidden: false,
  locked: false,
});

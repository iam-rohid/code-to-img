import { nanoid } from "nanoid";

import { iImage } from "@/data/images";
import {
  iCodeEditorElement,
  iEmojiElement,
  iTextElement,
} from "../validator/elements";
import { iImageElement } from "../validator/elements/image";

import { DEFAULT_THEME } from "./code-editor-themes";

export interface GetElementArgs {
  id: string;
  name?: string;
  width?: number;
  height?: number;
  autoHeight?: boolean;
  autoWidth?: boolean;
  widthHeightLinked?: boolean;
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
  autoHeight = true,
  autoWidth = false,
  widthHeightLinked = false,
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
  autoWidth,
  autoHeight,
  widthHeightLinked,
  rotation: 0,
  scale: 1,
  fontSize: 16,
  lineHeight: 24,
  showLineNumbers: true,
  padding: {
    top: 12,
    left: 12,
    right: 12,
    bottom: 12,
    horizontalLinked: false,
    verticalLinked: false,
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
      name: "index.js",
      code: 'console.log("Hello, World")',
      language: "javascript",
    },
  ],
  border: true,
  boxShadow: "0 22px 32px -6px rgba(0,0,0,0.65)",
  borderRadius: 10,
});

export interface GetTextElementProps extends GetElementArgs {
  content?: Record<string, unknown>;
}
const CURRENT_TEXT_ELEMENT_VERSION = "0.1.0";

export const getTextElement = ({
  id,
  width = 72,
  height = 44,
  name = "Text",
  content = {
    type: "doc",
    content: [
      {
        type: "paragraph",
        attrs: {
          textAlign: "left",
        },
        content: [
          {
            type: "text",
            marks: [
              {
                type: "textStyle",
                attrs: {
                  color: "rgb(0, 0, 0)",
                  fontSize: 16,
                },
              },
            ],
            text: "Text",
          },
        ],
      },
    ],
  },
  x = 0,
  y = 0,
  autoHeight = true,
  autoWidth = true,
  widthHeightLinked = false,
}: GetTextElementProps): iTextElement => ({
  version: CURRENT_TEXT_ELEMENT_VERSION,
  type: "text",
  id,
  name,
  content,
  x,
  y,
  height,
  width,
  autoHeight,
  autoWidth,
  widthHeightLinked,
  background: {
    color: { type: "solid", color: "#FFFFFF" },
    image: null,
    imageFill: "cover",
  },
  rotation: 0,
  scale: 1,
  padding: {
    bottom: 8,
    left: 8,
    right: 8,
    top: 8,
    horizontalLinked: false,
    verticalLinked: false,
  },
  verticalAlignment: "center",
  hidden: false,
  locked: false,
  borderRadius: 10,
  boxShadow: "none",
});

export interface GetImageElementProps extends GetElementArgs {
  image: iImage;
}
const CURRENT_IMGAE_ELEMENT_VERSION = "0.1.0";

export const getImageElement = ({
  id,
  image,
  width = image.width ?? 256,
  height = image.height ?? 256,
  name = "Image",
  x = 0,
  y = 0,
  autoHeight = false,
  autoWidth = false,
  widthHeightLinked = true,
}: GetImageElementProps): iImageElement => ({
  version: CURRENT_IMGAE_ELEMENT_VERSION,
  type: "image",
  id,
  name,
  x,
  y,
  height,
  width,
  autoHeight,
  autoWidth,
  widthHeightLinked,
  rotation: 0,
  scale: 1,
  hidden: false,
  locked: false,
  boxShadow: "none",
  objectFit: "cover",
  src: image.src,
  alt: image.alt,
});

export interface GetEmojiElementProps extends GetElementArgs {
  emoji: string;
}
const CURRENT_EMOJI_ELEMENT_VERSION = "0.1.0";

export const getEmojiElement = ({
  id,
  emoji,
  width = 256,
  height = 256,
  name = "Emoji",
  x = 0,
  y = 0,
  autoHeight = false,
  autoWidth = false,
  widthHeightLinked = true,
}: GetEmojiElementProps): iEmojiElement => ({
  version: CURRENT_EMOJI_ELEMENT_VERSION,
  type: "emoji",
  id,
  name,
  x,
  y,
  height,
  width,
  autoHeight,
  autoWidth,
  widthHeightLinked,
  rotation: 0,
  scale: 1,
  hidden: false,
  locked: false,
  boxShadow: "none",
  emoji,
});

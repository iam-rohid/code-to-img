import { iSnippetData } from "../validator/snippet";
import { iTransform } from "../validator/transform";

import { getCodeEditorElement } from "./elements";

export interface Template {
  id: string;
  name: string;
  data: iSnippetData;
}

const BASE_TRANSFORM: iTransform = {
  width: 600,
  height: 400,
  widthHeightLinked: false,
  position: {
    x: 0,
    y: 0,
  },
  rotation: 0,
  scale: 1,
};

export const BLANK_SNIPPET_TEMPLATE: Template = {
  id: "blank",
  name: "Blank",
  data: {
    transform: BASE_TRANSFORM,
    background: {
      color: {
        type: "gradient",
        colors: ["#FBDA61", "#FF5ACD"],
        angle: 45,
      },
    },
    elements: [],
  },
};

export const DEFAULT_SNIPPET_TEMPLATE: Template = {
  id: "default",
  name: "Default",
  data: {
    transform: BASE_TRANSFORM,
    background: {
      color: {
        type: "gradient",
        colors: ["#4158D0", "#C850C0", "#FFCC70"],
        angle: 43,
      },
    },
    elements: [
      getCodeEditorElement({
        id: "code-editor-01",
        canvasHeight: BASE_TRANSFORM.height,
        canvasWidth: BASE_TRANSFORM.width,
      }),
    ],
  },
};

export const SYSTEM_SNIPPET_TEMPLATES: Template[] = [
  BLANK_SNIPPET_TEMPLATE,
  DEFAULT_SNIPPET_TEMPLATE,
];

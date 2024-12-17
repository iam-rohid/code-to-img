import { getCenterXYForElement } from "../utils";
import { iSnippetData } from "../validator/snippet";

import { GRADIENTS } from "./colors";
import { getCodeEditorElement } from "./elements";
import { CURRENT_SNIPPET_VERSION } from "./snippet";

export interface Template {
  id: string;
  name: string;
  data: iSnippetData;
}

export const BLANK_SNIPPET_TEMPLATE: Template = {
  id: "blank",
  name: "Blank",
  data: {
    version: CURRENT_SNIPPET_VERSION,
    width: 600,
    height: 400,
    widthHeightLinked: false,
    background: {
      color: GRADIENTS[2],
      image:
        "/images/wallpapers/codioful-formerly-gradienta-aAcAeRyhDX0-unsplash.jpg",
      imageFill: "cover",
    },
    elements: [],
  },
};

export const DEFAULT_SNIPPET_TEMPLATE: Template = {
  id: "default",
  name: "Default",
  data: {
    version: CURRENT_SNIPPET_VERSION,
    width: 600,
    height: 400,
    widthHeightLinked: false,
    background: {
      color: GRADIENTS[8],
      image:
        "/images/wallpapers/codioful-formerly-gradienta-C0EW4NoDg_E-unsplash.jpg",
      imageFill: "cover",
    },
    elements: [
      getCodeEditorElement({
        id: "code-editor-01",
        width: 400,
        height: 93,
        ...getCenterXYForElement({
          canvasHeight: 400,
          canvasWidth: 600,
          width: 400,
          height: 93,
        }),
      }),
    ],
  },
};

export const SYSTEM_SNIPPET_TEMPLATES: Template[] = [
  BLANK_SNIPPET_TEMPLATE,
  DEFAULT_SNIPPET_TEMPLATE,
];

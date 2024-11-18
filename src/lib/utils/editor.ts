import { CSSProperties } from "react";
import { nanoid } from "nanoid";

import { iColor } from "../validator/color";
import { iCodeEditorElement, iTextElement } from "../validator/element";
import { iPadding } from "../validator/padding";
import { iSnippetData } from "../validator/snippet";

export function getPaddingStyle(padding: iPadding): CSSProperties {
  return {
    paddingLeft: padding.left,
    paddingRight: padding.right,
    paddingTop: padding.top,
    paddingBottom: padding.bottom,
  };
}

export function getBackgroundStyle(color: iColor): CSSProperties {
  switch (color.type) {
    case "solid":
      return { background: color.color };
    case "gradient":
      return {
        background: `linear-gradient(${color.angle}deg, ${color.colors.map((colorHash, i) => `${colorHash} ${(i * 100) / (color.colors.length - 1)}%`).join(", ")}`,
      };

    default:
      return {};
  }
}

export const getCodeEditorElement = (
  canvasWidth: number,
  canvasHeight: number,
  width = 400,
  height = 86,
): iCodeEditorElement => ({
  id: nanoid(),
  name: "Code Editor",
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
  lineNumbers: true,
  theme: "theme-1",
  padding: {
    top: 0,
    left: 0,
    right: 12,
    bottom: 12,
  },
});

export const getTextElement = (
  canvasWidth: number,
  canvasHeight: number,
  width = 72,
  height = 44,
): iTextElement => ({
  id: nanoid(),
  type: "text",
  name: "Text",
  text: "Text",
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

export const getDefaultSnippetData = (): iSnippetData => ({
  transform: {
    width: 600,
    height: 400,
    widthHeightLinked: false,
    position: {
      x: 0,
      y: 0,
    },
    rotation: 0,
    scale: 1,
  },
  background: {
    color: {
      type: "gradient",
      colors: ["#3B41C5FF", "#A981BBFF", "#CA62FAFF", "#FFC8A9FF"],
      angle: 147,
    },
  },
  elements: [getCodeEditorElement(600, 400)],
});

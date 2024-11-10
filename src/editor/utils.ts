import { nanoid } from "nanoid";
import { iColor, iElement } from "./types";
import { CSSProperties } from "react";

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
): iElement => ({
  id: nanoid(),
  name: "Code Editor",
  transform: {
    height,
    width,
    minHeight: 20,
    minWidth: 20,
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
  lineNumbers: false,
  theme: "tokyo-night",
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
): iElement => ({
  id: nanoid(),
  type: "text",
  name: "Text",
  value: "Text",
  color: "#000",
  backgroundColor: "#fff",
  fontWeight: "900",
  lineHeight: 1,
  fontSize: 24,
  padding: 8,
  transform: {
    height,
    width,
    minHeight: 20,
    minWidth: 20,
    widthHeightLinked: false,
    position: {
      x: canvasWidth / 2 - width / 2,
      y: canvasHeight / 2 - height / 2,
    },
    rotation: 0,
    scale: 1,
  },
});

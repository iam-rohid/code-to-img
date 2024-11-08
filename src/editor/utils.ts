import { nanoid } from "nanoid";
import { iElement } from "./types";

export const getCodeEditorElement = (
  canvasWidth: number,
  canvasHeight: number,
  width = 400,
  height = 250,
): iElement => ({
  type: "code-editor",
  id: nanoid(),
  name: "Code Editor",
  transform: {
    height,
    width,
    minHeight: 100,
    minWidth: 100,
    widthHeightLinked: false,
    position: {
      x: canvasWidth / 2 - width / 2,
      y: canvasHeight / 2 - height / 2,
    },
    rotation: 0,
    scale: 1,
  },
});

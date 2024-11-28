import { CSSProperties } from "react";

import { iElement } from "@/lib/validator/elements";

export const getElementWrapperStyle = (element: iElement): CSSProperties => {
  const offsetX = (element.width * element.scale - element.width) / 2;
  const offsetY = (element.height * element.scale - element.height) / 2;

  return {
    position: "absolute",
    display: element.hidden ? "none" : undefined,
    pointerEvents: element.locked ? "none" : "auto",
    left: element.x,
    top: element.y,
    width: element.autoWidth ? "fit-content" : element.width,
    height: element.autoHeight ? "fit-content" : element.height,
    minWidth: 20,
    minHeight: 20,
    transform: `
        translate(${offsetX}px, ${offsetY}px) 
        rotate(${element.rotation}deg) 
        scale(${element.scale})
      `,
  };
};

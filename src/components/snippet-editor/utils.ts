import { CSSProperties } from "react";

import { iElement } from "@/lib/validator/element";

export const getElementWrapperStyle = (element: iElement): CSSProperties => {
  const offsetX =
    (element.transform.width * element.transform.scale -
      element.transform.width) /
    2;

  const offsetY =
    (element.transform.height * element.transform.scale -
      element.transform.height) /
    2;

  return {
    position: "absolute",
    display: element.hidden ? "none" : undefined,
    pointerEvents: element.locked ? "none" : "auto",
    left: element.transform.position.x,
    top: element.transform.position.y,
    width: element.transform.autoWidth
      ? "fit-content"
      : element.transform.width,
    height: element.transform.autoHeight
      ? "fit-content"
      : element.transform.height,
    minWidth: 20,
    minHeight: 20,
    transform: `
        translate(${offsetX}px, ${offsetY}px) 
        rotate(${element.transform.rotation}deg) 
        scale(${element.transform.scale})
      `,
  };
};

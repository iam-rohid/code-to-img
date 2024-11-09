import { iElement } from "../types";
import Draggable from "./draggable";

export default function TextElement({ element }: { element: iElement }) {
  if (element.type !== "text") {
    return null;
  }

  return (
    <Draggable element={element} className="h-full w-full">
      <p
        className="h-full w-full overflow-hidden rounded-md leading-none"
        style={{
          textAlign: element.textAlign,
          fontSize: element.fontSize,
          fontWeight: element.fontWeight,
          fontFamily: element.fontFamily,
          letterSpacing: element.letterSpacing,
          color: element.color,
          backgroundColor: element.backgroundColor,
          lineHeight: element.lineHeight,
          padding: element.padding,
        }}
      >
        {element.value}
      </p>
    </Draggable>
  );
}

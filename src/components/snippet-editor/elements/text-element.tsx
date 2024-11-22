import { getBackgroundStyle, getPaddingStyle } from "@/lib/utils/editor";
import { iTextElement } from "@/lib/validator/element";

import Draggable from "./shared/draggable";

export default function TextElement({ element }: { element: iTextElement }) {
  return (
    <Draggable element={element} className="h-full w-full">
      <p
        className="h-full w-full overflow-hidden rounded-md leading-none"
        style={{
          textAlign: element.horizontalAlignment,
          fontSize: element.fontSize,
          fontWeight: element.fontWeight,
          fontFamily: element.fontFamily,
          letterSpacing: element.letterSpacing,
          color: element.foregrounnd,
          lineHeight: element.lineHeight,
          ...getPaddingStyle(element.padding),
          ...getBackgroundStyle(element.background.color),
        }}
      >
        {element.text}
      </p>
    </Draggable>
  );
}

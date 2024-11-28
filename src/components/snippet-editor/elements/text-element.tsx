import { getBackgroundStyle, getPaddingStyle } from "@/lib/utils/editor";
import { iTextElement } from "@/lib/validator/elements";

export default function TextElement({ element }: { element: iTextElement }) {
  return (
    <div
      id={element.id}
      data-cti-element-id={element.id}
      className="cti-drag-handle h-full w-full select-none overflow-hidden rounded-md leading-none"
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
    </div>
  );
}

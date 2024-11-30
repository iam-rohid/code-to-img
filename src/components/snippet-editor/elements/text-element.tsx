import { getBackgroundStyle, getPaddingStyle } from "@/lib/utils/editor";
import { iTextElement } from "@/lib/validator/elements";

export default function TextElement({ element }: { element: iTextElement }) {
  return (
    <div
      id={element.id}
      data-cti-element-id={element.id}
      className="cti-drag-handle flex h-full w-full select-none overflow-hidden whitespace-pre leading-none"
      style={{
        ...getPaddingStyle(element.padding),
        ...getBackgroundStyle(element.background.color),
        borderRadius: element.borderRadius,
        justifyContent: element.horizontalAlignment,
        alignItems: element.verticalAlignment,
        boxShadow: element.boxShadow,
        color: element.foregrounnd,
        textShadow: element.textShadow
          ? `1px 1px 3px rgba(0,0,0,0.5)`
          : undefined,
        textAlign: element.horizontalAlignment,
        fontSize: element.fontSize,
        fontWeight: element.fontWeight,
        fontFamily: element.fontFamily,
        letterSpacing: element.letterSpacing,
        lineHeight: element.lineHeight,
      }}
    >
      {element.text}
    </div>
  );
}

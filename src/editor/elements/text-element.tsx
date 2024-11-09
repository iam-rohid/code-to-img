import { useEditorStore } from "../store";
import Draggable from "./draggable";

export default function TextElement({ elementId }: { elementId: string }) {
  const element = useEditorStore((state) =>
    state.canvas.elements.find((element) => element.id === elementId),
  );

  if (element?.type !== "text") {
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

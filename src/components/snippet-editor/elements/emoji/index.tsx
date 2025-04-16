import { ContextMenuTrigger } from "@/components/ui/context-menu";
import { iEmojiElement } from "@/lib/validator/elements";
import { useDragElement } from "../../use-drag-element";

export default function EmojiElement({
  element,
  readOnly,
  onChange,
  zoom = 1,
  onDragEnd,
  onDragStart,
}: {
  element: iEmojiElement;
  onChange?: (element: Partial<iEmojiElement>) => void;
  readOnly?: boolean;
  zoom?: number;
  onDragStart?: () => void;
  onDragEnd?: () => void;
}) {
  const { onMouseDown } = useDragElement({
    x: element.x,
    y: element.y,
    zoom,
    readOnly,
    onDrag: (pos) => onChange?.({ x: pos.x, y: pos.y }),
    onDragEnd,
    onDragStart,
  });

  return (
    <ContextMenuTrigger
      className="h-full min-h-full w-full min-w-full whitespace-pre"
      onMouseDown={onMouseDown}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
      >
        <text
          x="50%"
          y="50%"
          text-anchor="middle"
          dominant-baseline="central"
          font-size="75"
        >
          {element.emoji}
        </text>
      </svg>
    </ContextMenuTrigger>
  );
}

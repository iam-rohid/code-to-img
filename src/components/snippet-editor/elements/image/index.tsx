/* eslint-disable @next/next/no-img-element */

import { iImageElement } from "@/lib/validator/elements/image";
import { useDragElement } from "../../use-drag-element";

export default function ImageElement({
  element,
  readOnly,
  onChange,
  zoom = 1,
  onDragEnd,
  onDragStart,
}: {
  element: iImageElement;
  onChange?: (element: Partial<iImageElement>) => void;
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
    <div
      className="h-full min-h-full w-full min-w-full whitespace-pre"
      onMouseDown={onMouseDown}
    >
      <img
        src={element.src}
        alt={element.alt ?? element.id}
        width={element.width}
        height={element.height}
        style={{
          objectFit: element.objectFit,
          width: "100%",
          height: "100%",
        }}
        className="pointer-events-none h-full w-full"
      />
    </div>
  );
}

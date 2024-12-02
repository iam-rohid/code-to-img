import "prosemirror-view/style/prosemirror.css";

import { useEffect, useRef, useState } from "react";

import ProseMirrorEditor from "@/components/prosemirror-editor";
import { cn } from "@/lib/utils";
import { getBackgroundStyle, getPaddingStyle } from "@/lib/utils/editor";
import { iTextElement } from "@/lib/validator/elements";
import { useDragElement } from "../../use-drag-element";

export default function TextElement({
  element,
  readOnly,
  onChange,
  zoom = 1,
  onDragEnd,
  onDragStart,
}: {
  element: iTextElement;
  onChange?: (element: Partial<iTextElement>) => void;
  readOnly?: boolean;
  zoom?: number;
  onDragStart?: () => void;
  onDragEnd?: () => void;
}) {
  const [value, setValue] = useState(element.value);
  const [editing, setEditing] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { onMouseDown } = useDragElement({
    x: element.x,
    y: element.y,
    zoom,
    readOnly,
    onDrag: (pos) => onChange?.({ x: pos.x, y: pos.y }),
    onDoubleClick: () => {
      setEditing(true);
    },
    onDragEnd,
    onDragStart,
  });

  useEffect(() => {
    setValue(element.value);
  }, [element.value]);

  return (
    <div
      className={cn("flex h-full w-full overflow-hidden", {
        "[&_.ProseMirror]:whitespace-pre": element.autoWidth,
      })}
      style={{
        ...getPaddingStyle(element.padding),
        ...getBackgroundStyle(element.background.color),
        borderRadius: element.borderRadius,
        boxShadow: element.boxShadow,
        color: element.foregrounnd,
      }}
    >
      {editing ? (
        <ProseMirrorEditor
          value={value}
          onChange={(value) => {
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
            }
            setValue(value);
            timeoutRef.current = setTimeout(() => {
              onChange?.({ value });
            }, 200);
          }}
          onBlur={() => setEditing(false)}
        />
      ) : (
        <div
          dangerouslySetInnerHTML={{ __html: value }}
          onMouseDown={onMouseDown}
          className="ProseMirror select-none"
        />
      )}
    </div>
  );
}

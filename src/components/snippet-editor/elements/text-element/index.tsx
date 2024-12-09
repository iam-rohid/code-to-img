import "./style.css";

import { useEffect, useState } from "react";
import { Editor, EditorContent, EditorEvents } from "@tiptap/react";

import { cn } from "@/lib/utils";
import { getBackgroundStyle, getPaddingStyle } from "@/lib/utils/editor";
import { iTextElement } from "@/lib/validator/elements";
import { useDragElement } from "../../use-drag-element";

import Menu from "./menu";

export default function TextElement({
  element,
  readOnly,
  onChange,
  zoom = 1,
  onDragEnd,
  onDragStart,
  onEditingEnd,
  onEditingStart,
  isSelected,
  editor,
  onTransaction,
  onUpdate,
}: {
  element: iTextElement;
  onChange?: (element: Partial<iTextElement>) => void;
  readOnly?: boolean;
  zoom?: number;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  onEditingStart?: () => void;
  onEditingEnd?: () => void;
  editor: Editor;
  isSelected?: boolean;
  onTransaction?: (props: EditorEvents["transaction"]) => void;
  onUpdate?: (props: EditorEvents["update"]) => void;
}) {
  const [editable, setEditing] = useState(false);
  const { onMouseDown } = useDragElement({
    x: element.x,
    y: element.y,
    zoom,
    readOnly,
    onDrag: (pos) => onChange?.({ x: pos.x, y: pos.y }),
    onDoubleClick: () => {
      if (readOnly || element.hidden || element.locked) {
        return;
      }
      setEditing(true);
      onEditingStart?.();
      editor?.commands.focus("all");
    },
    onDragEnd,
    onDragStart,
  });

  useEffect(() => {
    if (!isSelected && editable) {
      editor.chain().selectAll().blur().run();
      setEditing(false);
      onEditingEnd?.();
    }
  }, [editable, editor, isSelected, onEditingEnd]);

  useEffect(() => {
    if (editor) {
      editor.setEditable(editable);
    }
  }, [editable, editor]);

  useEffect(() => {
    if (onTransaction) {
      editor.on("transaction", onTransaction);
    }
    if (onUpdate) {
      editor.on("update", onUpdate);
    }
    return () => {
      if (onTransaction) {
        editor.off("transaction", onTransaction);
      }
      if (onUpdate) {
        editor.off("update", onUpdate);
      }
    };
  }, [editor, onTransaction, onUpdate]);

  return (
    <div
      className={cn("relative flex h-full w-full overflow-hidden", {
        "[&_.ProseMirror]:whitespace-pre": element.autoWidth,
      })}
      style={{
        ...getPaddingStyle(element.padding),
        ...getBackgroundStyle(element.background.color),
        borderRadius: element.borderRadius,
        boxShadow: element.boxShadow,
      }}
    >
      {editable && <Menu editor={editor} padding={element.padding} />}
      <EditorContent
        editor={editor ?? null}
        className="h-full w-full overflow-hidden [&_.ProseMirror]:h-full [&_.ProseMirror]:w-full [&_.ProseMirror]:outline-none"
      />
      {!editable && (
        <div onMouseDown={onMouseDown} className="absolute inset-0 z-10" />
      )}
    </div>
  );
}

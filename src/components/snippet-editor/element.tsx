import { useCallback, useEffect, useRef } from "react";
import {
  BringToFrontIcon,
  CopyPlusIcon,
  SendToBackIcon,
  TrashIcon,
} from "lucide-react";
import { useStore } from "zustand";

import { getEditor } from "@/lib/tiptap";
import { iElement } from "@/lib/validator/elements";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
} from "../ui/context-menu";

import CodeEditorElement from "./elements/code-editor";
import EmojiElement from "./elements/emoji";
import ImageElement from "./elements/image";
import TextElement from "./elements/text-element";
import { useSnippetEditor } from "./snippet-editor";
import { getElementWrapperStyle } from "./utils";

export default function Element({ elementId }: { elementId: string }) {
  const { snippetStore, readOnly, editorStore } = useSnippetEditor();
  const element = useStore(snippetStore, (state) =>
    state.elements.find((el) => el.id === elementId),
  );
  if (!element) {
    throw new Error("element not found!");
  }
  const elementRef = useRef<HTMLDivElement>(null);
  const zoom = useStore(editorStore, (state) => state.zoom);
  const updateElement = useStore(snippetStore, (state) => state.updateElement);
  const removeElement = useStore(snippetStore, (state) => state.removeElement);
  const bringToFront = useStore(snippetStore, (state) => state.bringToFront);
  const sendToBack = useStore(snippetStore, (state) => state.sendToBack);
  const duplicateElement = useStore(
    snippetStore,
    (state) => state.duplicateElement,
  );

  const selectedElementId = useStore(
    editorStore,
    (state) => state.selectedElementId,
  );
  const tipTapEditors = useStore(editorStore, (state) => state.tipTapEditors);
  const setTipTapEditor = useStore(
    editorStore,
    (state) => state.setTipTapEditor,
  );
  const updateElementState = useStore(
    editorStore,
    (state) => state.updateElementState,
  );
  const setSelectedElement = useStore(
    editorStore,
    (state) => state.setSelectedElement,
  );
  const handleTabSelect = useStore(
    editorStore,
    (state) => state.handleTabSelect,
  );

  const handleMouseEnter = useCallback(() => {
    if (element.hidden || element.locked || readOnly) {
      return;
    }
    updateElementState(element.id, { hovering: true });
  }, [
    element.hidden,
    element.locked,
    element.id,
    readOnly,
    updateElementState,
  ]);

  const handleMouseLeave = useCallback(() => {
    if (element.hidden || element.locked || readOnly) {
      return;
    }
    updateElementState(element.id, { hovering: false });
  }, [
    element.hidden,
    element.locked,
    element.id,
    readOnly,
    updateElementState,
  ]);

  const handleMouseDown = useCallback(() => {
    if (element.hidden || element.locked || readOnly) {
      return;
    }
    setSelectedElement(element.id);
  }, [
    element.hidden,
    element.locked,
    element.id,
    readOnly,
    setSelectedElement,
  ]);

  useEffect(() => {
    if (element.hidden || element.locked || readOnly) {
      return;
    }

    const el = elementRef.current;
    if (!el) {
      return;
    }

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        const width = Math.ceil(entry.contentRect.width);
        const height = Math.ceil(entry.contentRect.height);

        const data: Partial<iElement> = {};
        if (element.autoWidth) {
          data.width = width;
        }
        if (element.autoHeight) {
          data.height = height;
        }
        if (
          typeof data.width === "undefined" &&
          typeof data.height === "undefined"
        ) {
          return;
        }
        updateElement(element.id, data);
      }
    });

    resizeObserver.observe(el);

    return () => {
      resizeObserver.unobserve(el);
    };
  }, [
    element.autoHeight,
    element.autoWidth,
    element.hidden,
    element.id,
    element.locked,
    readOnly,
    updateElement,
  ]);

  return (
    <ContextMenu>
      <div
        ref={elementRef}
        style={getElementWrapperStyle(element)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
      >
        {element.type === "code-editor" ? (
          <CodeEditorElement
            key={element.id}
            element={element}
            onChange={(updatedElement) => {
              updateElement(element.id, updatedElement);
            }}
            readOnly={readOnly}
            onTabSelect={(tabId) => handleTabSelect(element.id, tabId)}
            zoom={zoom}
            onDragStart={() =>
              updateElementState(element.id, { dragging: true })
            }
            onDragEnd={() =>
              updateElementState(element.id, { dragging: false })
            }
            onEditingStart={() =>
              updateElementState(element.id, { editing: true })
            }
            onEditingEnd={() =>
              updateElementState(element.id, { editing: false })
            }
          />
        ) : element.type === "text" ? (
          <TextElement
            key={element.id}
            element={element}
            onChange={(updatedElement) => {
              updateElement(element.id, updatedElement);
            }}
            readOnly={readOnly}
            zoom={zoom}
            onDragStart={() =>
              updateElementState(element.id, { dragging: true })
            }
            onDragEnd={() =>
              updateElementState(element.id, { dragging: false })
            }
            onEditingStart={() =>
              updateElementState(element.id, { editing: true })
            }
            onEditingEnd={() =>
              updateElementState(element.id, { editing: false })
            }
            isSelected={selectedElementId === element.id}
            editor={tipTapEditors[element.id]}
            onTransaction={({ editor }) => {
              setTipTapEditor(element.id, editor);
            }}
            onUpdate={({ editor, transaction }) => {
              if (transaction.docChanged) {
                const content = editor.getJSON();
                updateElement(element.id, { content });
              }
            }}
          />
        ) : element.type === "image" ? (
          <ImageElement
            key={element.id}
            element={element}
            onChange={(updatedElement) => {
              updateElement(element.id, updatedElement);
            }}
            readOnly={readOnly}
            zoom={zoom}
            onDragStart={() =>
              updateElementState(element.id, { dragging: true })
            }
            onDragEnd={() =>
              updateElementState(element.id, { dragging: false })
            }
          />
        ) : element.type === "emoji" ? (
          <EmojiElement
            key={element.id}
            element={element}
            onChange={(updatedElement) => {
              updateElement(element.id, updatedElement);
            }}
            readOnly={readOnly}
            zoom={zoom}
            onDragStart={() =>
              updateElementState(element.id, { dragging: true })
            }
            onDragEnd={() =>
              updateElementState(element.id, { dragging: false })
            }
          />
        ) : null}
      </div>
      <ContextMenuContent>
        <ContextMenuItem onClick={() => removeElement(element.id)}>
          <TrashIcon />
          Delete
        </ContextMenuItem>
        <ContextMenuItem
          onClick={() => {
            const duplicatedElement = duplicateElement(element.id);
            if (duplicatedElement) {
              if (duplicatedElement.type === "text") {
                setTipTapEditor(
                  duplicatedElement.id,
                  getEditor(duplicatedElement),
                );
              }
              setSelectedElement(duplicatedElement.id);
            }
          }}
        >
          <CopyPlusIcon />
          Duplicate
        </ContextMenuItem>
        <ContextMenuItem onClick={() => sendToBack(element.id)}>
          <SendToBackIcon />
          Send to Back
        </ContextMenuItem>
        <ContextMenuItem onClick={() => bringToFront(element.id)}>
          <BringToFrontIcon />
          Bring to Front
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

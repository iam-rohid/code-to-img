import { useCallback, useEffect, useRef } from "react";
import { useStore } from "zustand";

import { iTransform } from "@/lib/validator/transform";

import CodeEditorElement from "./elements/code-editor";
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

  const updateElementTransform = useStore(
    snippetStore,
    (state) => state.updateElementTransform,
  );
  const updateElement = useStore(snippetStore, (state) => state.updateElement);
  const updateElementState = useStore(
    editorStore,
    (state) => state.updateElementState,
  );
  const setSelectedElement = useStore(
    editorStore,
    (state) => state.setSelectedElement,
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

        const data: Partial<iTransform> = {};
        if (element.transform.autoWidth) {
          data.width = width;
        }
        if (element.transform.autoHeight) {
          data.height = height;
        }
        if (
          typeof data.width === "undefined" &&
          typeof data.height === "undefined"
        ) {
          return;
        }
        updateElementTransform(element.id, data);
      }
    });

    resizeObserver.observe(el);

    return () => {
      resizeObserver.unobserve(el);
    };
  }, [
    element.hidden,
    element.id,
    element.locked,
    element.transform.autoHeight,
    element.transform.autoWidth,
    readOnly,
    updateElementTransform,
  ]);

  return (
    <div
      ref={elementRef}
      style={getElementWrapperStyle(element)}
      {...(readOnly
        ? {}
        : {
            onMouseEnter: handleMouseEnter,
            onMouseLeave: handleMouseLeave,
            onMouseDown: handleMouseDown,
          })}
    >
      {element.type === "code-editor" ? (
        <CodeEditorElement
          element={element}
          onCodeChange={(code) => {
            updateElement(element.id, { code });
          }}
          readOnly={readOnly}
        />
      ) : element.type === "text" ? (
        <TextElement element={element} />
      ) : null}
    </div>
  );
}

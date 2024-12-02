import "prosemirror-view/style/prosemirror.css";
import "prosemirror-menu/style/menu.css";
import "./style.css";

import { useEffect, useRef, useState } from "react";
import { baseKeymap } from "prosemirror-commands";
import { dropCursor } from "prosemirror-dropcursor";
import { buildInputRules, buildKeymap } from "prosemirror-example-setup";
import { gapCursor } from "prosemirror-gapcursor";
import { keymap } from "prosemirror-keymap";
import { menuBar } from "prosemirror-menu";
import { DOMParser as ProseMirrorDOMParser } from "prosemirror-model";
import { EditorState, TextSelection } from "prosemirror-state";
import { EditorView } from "prosemirror-view";

import { buildMenuItems } from "./menu";
import { schema } from "./schema";

interface ProseMirrorEditorProps {
  value: string;
  defaultValue?: string;
  onChange?: (html: string) => void;
  onBlur?: (view?: EditorView) => void;
}

export default function ProseMirrorEditor({
  onChange,
  value,
  defaultValue,
  onBlur,
}: ProseMirrorEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const [docValue, setDocValue] = useState(value || defaultValue || "");

  useEffect(() => {
    if (!editorRef.current) {
      return;
    }

    const editorState = EditorState.create({
      doc: ProseMirrorDOMParser.fromSchema(schema).parse(
        new DOMParser().parseFromString(value, "text/html"),
      ),
      plugins: [
        keymap({
          Esc: (_state, _dispatch, view) => {
            onBlur?.(view);
            return true;
          },
        }),
        buildInputRules(schema),
        keymap(buildKeymap(schema)),
        keymap(baseKeymap),
        dropCursor(),
        gapCursor(),
        menuBar({
          floating: true,
          content: buildMenuItems(schema).fullMenu,
        }),
      ],
    });

    viewRef.current = new EditorView(editorRef.current, {
      state: editorState,
      dispatchTransaction(transaction) {
        const newState = viewRef.current!.state.apply(transaction);
        viewRef.current!.updateState(newState);

        if (transaction.docChanged) {
          const newHTML = viewRef.current!.dom.innerHTML;
          setDocValue(newHTML);
          onChange?.(newHTML);
        }
      },
      handleDOMEvents: {
        blur: (view) => {
          onBlur?.(view);
          return false;
        },
      },
    });

    const state = viewRef.current.state;
    const transaction = state.tr.setSelection(
      TextSelection.create(state.doc, 0, state.doc.content.size),
    );
    viewRef.current.dispatch(transaction);
    viewRef.current.focus();

    return () => {
      if (viewRef.current) {
        viewRef.current.destroy();
        viewRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (value && value !== docValue) {
      const newDoc = ProseMirrorDOMParser.fromSchema(schema).parse(
        new DOMParser().parseFromString(value, "text/html"),
      );
      const transaction = viewRef.current!.state.tr.replaceWith(
        0,
        viewRef.current!.state.doc.content.size,
        newDoc.content,
      );

      viewRef.current!.dispatch(transaction);
    }
  }, [docValue, value]);

  return <div ref={editorRef} className="h-full w-full" />;
}

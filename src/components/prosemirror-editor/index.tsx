import "prosemirror-menu/style/menu.css";
import "prosemirror-view/style/prosemirror.css";
import "./style.css";

import { useEffect, useRef, useState } from "react";
import { baseKeymap } from "prosemirror-commands";
import { dropCursor } from "prosemirror-dropcursor";
import { buildInputRules, buildKeymap } from "prosemirror-example-setup";
import { gapCursor } from "prosemirror-gapcursor";
import { keymap } from "prosemirror-keymap";
import { DOMParser as ProseMirrorDOMParser } from "prosemirror-model";
import { EditorState, TextSelection } from "prosemirror-state";
import { EditorView } from "prosemirror-view";

// import { buildMenuItems } from "./menu";
import CustomMenu from "./menu";
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
  const [editorState, setEditorState] = useState<EditorState | undefined>(
    undefined,
  );
  const [editorView, setEditorView] = useState<EditorView | undefined>(
    undefined,
  );
  const editorRef = useRef<HTMLDivElement>(null);
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
      ],
    });

    const view = new EditorView(editorRef.current, {
      state: editorState,
      dispatchTransaction(transaction) {
        try {
          const newState = view.state.apply(transaction);
          view.updateState(newState);
          setEditorState(newState);

          if (transaction.docChanged) {
            const newHTML = view.dom.innerHTML;
            setDocValue(newHTML);
            onChange?.(newHTML);
          }
        } catch (error) {
          console.log(error);
        }
      },
      handleDOMEvents: {
        blur: (view) => {
          onBlur?.(view);
          return false;
        },
      },
    });

    const state = view.state;
    const transaction = state.tr.setSelection(
      TextSelection.create(state.doc, 0, state.doc.content.size),
    );
    view.dispatch(transaction);
    view.focus();

    setEditorView(view);

    return () => {
      view.destroy();
      setEditorView(undefined);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!editorView) {
      return;
    }
    if (value && value !== docValue) {
      const newDoc = ProseMirrorDOMParser.fromSchema(schema).parse(
        new DOMParser().parseFromString(value, "text/html"),
      );
      const transaction = editorView.state.tr.replaceWith(
        0,
        editorView.state.doc.content.size,
        newDoc.content,
      );

      editorView.dispatch(transaction);
    }
  }, [docValue, editorView, value]);

  return (
    <>
      <div ref={editorRef} className="h-full w-full outline-none" />
      <CustomMenu editorState={editorState} editorView={editorView} />
    </>
  );
}

import { useMemo } from "react";
import { loadLanguage } from "@uiw/codemirror-extensions-langs";
import CodeMirror, { EditorView, Extension } from "@uiw/react-codemirror";
import { useStore } from "zustand";

import { codeEditorThemes } from "@/lib/constants/code-editor-themes";
import { iCodeEditorElement } from "@/lib/validator/element";
import { useEditor } from "../editor";

import Draggable from "./shared/draggable";

export default function CodeEditorElement({
  element,
}: {
  element: iCodeEditorElement;
}) {
  const { store, readOnly } = useEditor();
  const updateElement = useStore(store, (state) => state.updateElement);

  const theme = useMemo(
    () => codeEditorThemes.find((theme) => theme.id === element.theme),
    [element.theme],
  );

  const extensions = useMemo(() => {
    const extensions: Extension[] = [];
    const lang = loadLanguage(element.language);
    if (lang) {
      extensions.push(lang);
    }
    if (!element.transform.autoWidth) {
      extensions.push(EditorView.lineWrapping);
    }
    return extensions;
  }, [element.language, element.transform.autoWidth]);

  return (
    <div
      className="flex h-full w-full flex-col overflow-hidden"
      style={{
        background: theme?.window?.background,
        backgroundImage: theme?.window?.backgroundImage,
        color: theme?.window?.foreground,
        ...theme?.window?.style,
      }}
    >
      <div
        style={{
          background: theme?.window?.titleBarBackground,
          color: theme?.window?.titleBarForeground,
          ...theme?.window?.titleBarStyle,
        }}
        className="flex-shrink-0 overflow-hidden"
      >
        <Draggable element={element}>
          <div className="flex h-full items-center gap-2 py-[15px] pl-[14px]">
            <div
              className="h-[12px] w-[12px] flex-shrink-0 rounded-full bg-[#FEBC2E]"
              style={{
                backgroundColor: theme?.window?.titleBarTraficLightColor1,
              }}
            ></div>
            <div
              className="h-[12px] w-[12px] flex-shrink-0 rounded-full bg-[#FF5F57]"
              style={{
                backgroundColor: theme?.window?.titleBarTraficLightColor2,
              }}
            ></div>
            <div
              className="h-[12px] w-[12px] flex-shrink-0 rounded-full bg-[#28C840]"
              style={{
                backgroundColor: theme?.window?.titleBarTraficLightColor3,
              }}
            ></div>
          </div>
        </Draggable>
      </div>
      <div
        className="flex flex-1 overflow-hidden"
        style={{
          ...theme?.window?.codeMirrorContainerStyle,
          paddingLeft: element.padding.left,
          paddingRight: element.padding.right,
          paddingTop: element.padding.top,
          paddingBottom: element.padding.bottom,
        }}
      >
        <CodeMirror
          value={element.code}
          theme={theme?.theme}
          height={element.transform.autoHeight ? undefined : "100%"}
          width={
            element.transform.autoWidth
              ? undefined
              : `${element.transform.width}px`
          }
          extensions={extensions}
          onChange={(value) => {
            updateElement(element.id, { code: value });
          }}
          readOnly={readOnly}
          basicSetup={{
            lineNumbers: element.lineNumbers,
            highlightActiveLine: false,
            highlightActiveLineGutter: false,
            foldGutter: false,
          }}
          style={{
            fontSize: element.fontSize,
            lineHeight: element.lineHeight,
            ...theme?.window?.codeMirrorStyle,
          }}
        />
      </div>
    </div>
  );
}

import { CSSProperties, useMemo } from "react";
import { loadLanguage } from "@uiw/codemirror-extensions-langs";
import { tokyoNightInit } from "@uiw/codemirror-theme-tokyo-night";
import CodeMirror, { EditorView, Extension } from "@uiw/react-codemirror";

import { iCodeEditorElement } from "@/lib/validator/element";
import { useSnippetStore } from "@/providers/snippet-store-provider";

import Draggable from "./shared/draggable";

const themes: {
  id: string;
  theme: Extension;
  window?: {
    background?: string;
    backgroundImage?: string;
    foreground?: string;
    titleBarBackground?: string;
    titleBarForeground?: string;
    titleBarTraficLightColor1?: string;
    titleBarTraficLightColor2?: string;
    titleBarTraficLightColor3?: string;
    style?: CSSProperties;
    titleBarStyle?: CSSProperties;
    codeMirrorContainerStyle?: CSSProperties;
    codeMirrorStyle?: CSSProperties;
  };
}[] = [
  {
    id: "tokyo-night",
    theme: tokyoNightInit(),
    window: {
      background: "#1A1B26",
      foreground: "#BBC5EE",
      titleBarBackground: "#1A1B26",
      titleBarTraficLightColor1: "#444764",
      titleBarTraficLightColor2: "#444764",
      titleBarTraficLightColor3: "#444764",
    },
  },
];

export default function CodeEditorElement({
  element,
}: {
  element: iCodeEditorElement;
}) {
  const updateElement = useSnippetStore((state) => state.updateElement);
  const theme = useMemo(
    () => themes.find((theme) => theme.id === element.theme),
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
      className="flex h-full w-full flex-col overflow-hidden rounded-xl border border-zinc-700 bg-zinc-800 text-zinc-200 shadow-xl"
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
          <div className="flex h-full items-center gap-2 py-4 pl-4">
            <div
              className="h-3.5 w-3.5 flex-shrink-0 rounded-full bg-[#FEBC2E]"
              style={{
                backgroundColor: theme?.window?.titleBarTraficLightColor1,
              }}
            ></div>
            <div
              className="h-3.5 w-3.5 flex-shrink-0 rounded-full bg-[#FF5F57]"
              style={{
                backgroundColor: theme?.window?.titleBarTraficLightColor2,
              }}
            ></div>
            <div
              className="h-3.5 w-3.5 flex-shrink-0 rounded-full bg-[#28C840]"
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

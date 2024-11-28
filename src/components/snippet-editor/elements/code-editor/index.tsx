/** @jsxImportSource @emotion/react */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { loadLanguage } from "@uiw/codemirror-extensions-langs";
import CodeMirror, {
  EditorView,
  Extension,
  lineNumbers,
} from "@uiw/react-codemirror";
import Color from "color";
import { PlusIcon, XIcon } from "lucide-react";
import { nanoid } from "nanoid";

import {
  CODE_EDITOR_THEMES,
  CodeEditorTheme,
} from "@/lib/constants/code-editor-themes";
import { cn } from "@/lib/utils";
import { CodeEditorTab, iCodeEditorElement } from "@/lib/validator/elements";

import { TITLE_BAR_CONTROLS } from "./controls";

const MAX_TABS = 4;

export default function CodeEditorElement({
  element,
  readOnly,
  onChange,
  onTabSelect,
}: {
  element: iCodeEditorElement;
  readOnly?: boolean;
  onChange?: (element: iCodeEditorElement) => void;
  onTabSelect?: (tabId: string) => void;
}) {
  const [selectedTabId, setSelectedTabId] = useState(() => element.tabs[0].id);
  const theme = useMemo(
    () =>
      CODE_EDITOR_THEMES.find((theme) => theme.id === element.theme) ??
      CODE_EDITOR_THEMES[0]!,
    [element.theme],
  );
  const background = useMemo(
    () => Color(theme.settings.background),
    [theme.settings.background],
  );
  const secondaryBackground = useMemo(
    () => (theme.isDark ? background.darken(0.3) : background.darken(0.05)),
    [background, theme.isDark],
  );
  const secondaryBackground2 = useMemo(
    () => (theme.isDark ? background.lighten(0.4) : background.darken(0.1)),
    [background, theme.isDark],
  );
  const borderColor = useMemo(
    () => (theme.isDark ? background.lighten(1) : background.darken(0.2)),
    [background, theme.isDark],
  );

  const extensions = useMemo(() => {
    const extensions: Extension[] = [];
    if (!element.autoWidth) {
      extensions.push(EditorView.lineWrapping);
    }
    if (element.showLineNumbers) {
      extensions.push(
        lineNumbers({
          formatNumber: (n) => {
            return (n + element.lineNumbersStartFrom - 1).toString();
          },
        }),
      );
    }
    return extensions;
  }, [
    element.autoWidth,
    element.lineNumbersStartFrom,
    element.showLineNumbers,
  ]);

  const handleAddNewTab = useCallback(() => {
    if (element.tabs.length >= MAX_TABS) {
      return;
    }
    const newTab: CodeEditorTab = {
      id: nanoid(),
      code: "// Enter your code here",
      language: "javascript",
      name: "index.js",
    };
    onChange?.({
      ...element,
      tabs: [...element.tabs, newTab],
    });
    setSelectedTabId(newTab.id);
  }, [element, onChange]);

  const handleRemoveTab = useCallback(
    (tabId: string) => {
      const newTabsList = element.tabs.filter((tab) => tab.id !== tabId);
      if (newTabsList.length === 0) {
        return;
      }

      onChange?.({
        ...element,
        tabs: newTabsList,
      });
      if (tabId === selectedTabId) {
        setSelectedTabId(newTabsList[0].id);
      }
    },
    [element, onChange, selectedTabId],
  );

  useEffect(() => {
    onTabSelect?.(selectedTabId);
  }, [onTabSelect, selectedTabId]);

  return (
    <div
      className="code-editor relative flex h-full w-full flex-col overflow-hidden"
      style={{
        backgroundImage: theme.settings.backgroundImage,
        backgroundColor: theme.settings.background,
        color: theme.settings.foreground,
        boxShadow: [
          ...(element.border
            ? [`0 0 0 0.5px rgba(0,0,0,${theme.isDark ? 0.8 : 0.4})`]
            : []),
          "0px 24px 32px -6px rgba(0,0,0,0.6)",
        ].join(", "),
        borderRadius: `10px`,
      }}
    >
      {element.showTitleBar ? (
        <TitleBar
          background={background}
          borderColor={borderColor}
          element={element}
          secondaryBackground={secondaryBackground}
          onAddTabClick={handleAddNewTab}
          onRemoveTabClick={handleRemoveTab}
          secondaryBackground2={secondaryBackground2}
          theme={theme}
          readOnly={readOnly}
          selectedTabId={selectedTabId}
          onSelectedTabChange={setSelectedTabId}
        />
      ) : (
        <div
          data-cti-element-id={element.id}
          className="cti-drag-handle absolute left-0 right-0 top-0 z-10 h-4"
        />
      )}

      {element.tabs.map((tab) => (
        <div
          key={tab.id}
          className={cn("overflow-hidden", {
            hidden: selectedTabId !== tab.id,
          })}
        >
          <TabContent
            key={tab.id}
            tab={tab}
            extensions={extensions}
            theme={theme.theme}
            element={element}
            onCodeChange={(code) =>
              onChange?.({
                ...element,
                tabs: element.tabs.map((oldTab) =>
                  oldTab.id === tab.id ? { ...oldTab, code } : oldTab,
                ),
              })
            }
            readOnly={readOnly}
          />
        </div>
      ))}

      {element.border && (
        <div
          className="pointer-events-none absolute inset-0 z-20"
          style={{
            boxShadow: `inset 0 0 0 1px ${borderColor}`,
            borderRadius: `10px`,
          }}
        />
      )}
    </div>
  );
}

function TabContent({
  tab,
  extensions: pExtensions = [],
  element,
  theme,
  onCodeChange,
  readOnly,
}: {
  tab: CodeEditorTab;
  extensions?: Extension[];
  theme: Extension;
  onCodeChange?: (value: string) => void;
  readOnly?: boolean;
  element: iCodeEditorElement;
}) {
  const [code, setCode] = useState(tab.code);
  const extensions = useMemo(() => {
    const extensions: Extension[] = [...pExtensions];
    const lang = loadLanguage(tab.language);
    if (lang) {
      extensions.push(lang);
    }
    return extensions;
  }, [pExtensions, tab.language]);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setCode(tab.code);
  }, [tab.code]);

  return (
    <CodeMirror
      key={tab.id}
      value={code}
      theme={theme}
      height={element.autoHeight ? undefined : "100%"}
      width={element.autoWidth ? undefined : `100%`}
      extensions={extensions}
      onChange={(value) => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        setCode(value);
        timeoutRef.current = setTimeout(() => {
          onCodeChange?.(value);
        }, 200);
      }}
      readOnly={readOnly}
      basicSetup={{
        highlightActiveLine: false,
        highlightActiveLineGutter: false,
        foldGutter: false,
        indentOnInput: true,
        lineNumbers: false,
        tabSize: element.tabSize,
      }}
      style={{
        maxWidth: "100%",
        flex: 1,
        overflow: "hidden",
        fontSize: element.fontSize,
        lineHeight: element.lineHeight,
        paddingLeft: element.padding.left,
        paddingRight: element.padding.right,
        paddingTop: element.padding.top,
        paddingBottom: element.padding.bottom,
        outline: "none",
      }}
      css={{
        ".cm-focused": {
          outline: "none",
        },
      }}
    />
  );
}

function TitleBar({
  element,
  background,
  secondaryBackground,
  borderColor,
  theme,
  secondaryBackground2,
  readOnly,
  onAddTabClick,
  onRemoveTabClick,
  selectedTabId,
  onSelectedTabChange,
}: {
  element: iCodeEditorElement;
  background: Color;
  secondaryBackground: Color;
  borderColor: Color;
  secondaryBackground2: Color;
  theme: CodeEditorTheme;
  readOnly?: boolean;
  onRemoveTabClick: (tabId: string) => void;
  onAddTabClick: () => void;
  selectedTabId: string;
  onSelectedTabChange: (tabId: string) => void;
}) {
  const Control = useMemo(
    () =>
      TITLE_BAR_CONTROLS.find(
        (control) => control.id === element.titleBarControlStyle,
      )?.Control,
    [element.titleBarControlStyle],
  );

  return (
    <div
      data-cti-element-id={element.id}
      className="cti-drag-handle flex-shrink-0 overflow-hidden"
      style={{
        backgroundColor:
          element.tabs.length > 1
            ? secondaryBackground.toString()
            : background.toString(),
        boxShadow:
          element.border && element.tabs.length > 1
            ? `inset 0 -1px 0 0 ${borderColor}`
            : undefined,
      }}
    >
      <div
        className={cn("flex h-10 items-center", {
          "flex-row-reverse": element.titleBarControlPosition === "right",
        })}
      >
        {Control ? (
          <div className="flex-shrink-0 px-4">
            <Control theme={theme} />
          </div>
        ) : null}
        <div className="flex h-full flex-1 overflow-hidden">
          <div className="flex flex-1 flex-nowrap items-center overflow-hidden">
            {element.tabs.map((tab) => {
              const selected = selectedTabId === tab.id;
              return (
                <div
                  key={tab.id}
                  className="group/tab relative flex h-full flex-1 overflow-hidden"
                >
                  <div
                    className={cn(
                      "flex h-full flex-1 cursor-pointer items-center overflow-hidden truncate px-3 text-center text-sm font-medium hover:bg-red-50",
                    )}
                    style={{
                      backgroundColor: selected
                        ? theme.settings.background
                        : "transparent",
                      boxShadow:
                        element.border && selected && element.tabs.length > 1
                          ? `inset 1px 0 0 ${borderColor}, inset -1px 0 0 ${borderColor}`
                          : undefined,
                    }}
                    css={{
                      ":hover": {
                        backgroundColor: selected
                          ? undefined
                          : secondaryBackground2.toString(),
                      },
                    }}
                    onClick={() => onSelectedTabChange(tab.id)}
                  >
                    {tab.name || "Untitled"}
                  </div>
                  {!readOnly && element.tabs.length > 1 && (
                    <div
                      className="absolute right-1 top-1/2 flex h-5 w-5 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full opacity-0 transition-opacity hover:bg-secondary group-hover/tab:opacity-100"
                      onClick={() => onRemoveTabClick(tab.id)}
                      css={{
                        ":hover": {
                          backgroundColor: secondaryBackground2.toString(),
                        },
                      }}
                    >
                      <XIcon className="h-3 w-3" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {!readOnly && element.tabs.length < MAX_TABS && (
            <button
              className="flex h-full w-7 flex-shrink-0 items-center justify-center"
              onClick={onAddTabClick}
              css={{
                ":hover": {
                  backgroundColor: secondaryBackground2.toString(),
                },
              }}
            >
              <PlusIcon className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

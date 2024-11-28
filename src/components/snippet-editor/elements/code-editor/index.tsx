/** @jsxImportSource @emotion/react */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as TabsPremitives from "@radix-ui/react-tabs";
import { loadLanguage } from "@uiw/codemirror-extensions-langs";
import CodeMirror, {
  EditorView,
  Extension,
  lineNumbers,
} from "@uiw/react-codemirror";
import Color from "color";
import { PlusIcon, XIcon } from "lucide-react";
import { nanoid } from "nanoid";

import { CODE_EDITOR_THEMES } from "@/lib/constants/code-editor-themes";
import { cn } from "@/lib/utils";
import { CodeEditorTab, iCodeEditorElement } from "@/lib/validator/elements";

import { TITLE_BAR_CONTROLS } from "./controls";

const MAX_TABS = 3;

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
    () =>
      background.isDark() ? background.darken(0.3) : background.darken(0.05),
    [background],
  );
  const secondaryBackground2 = useMemo(
    () =>
      background.isDark() ? background.lighten(0.4) : background.darken(0.1),
    [background],
  );
  const borderColor = useMemo(
    () =>
      background.isDark() ? background.lighten(1) : background.darken(0.1),
    [background],
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

  const Control = useMemo(
    () =>
      TITLE_BAR_CONTROLS.find(
        (control) => control.id === element.titleBarControlStyle,
      )?.Control,
    [element.titleBarControlStyle],
  );

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
    <TabsPremitives.Root
      value={selectedTabId}
      onValueChange={setSelectedTabId}
      id={element.id}
      className="code-editor flex h-full w-full flex-col overflow-hidden rounded-lg"
      style={{
        backgroundImage: theme.settings.backgroundImage,
        backgroundColor: theme.settings.background,
        color: theme.settings.foreground,
        boxShadow: `0 0 0 1px ${borderColor}`,
      }}
    >
      {element.showTitleBar ? (
        <div
          data-cti-element-id={element.id}
          className="cti-drag-handle flex-shrink-0 overflow-hidden"
          style={{
            backgroundColor:
              element.tabs.length > 1
                ? secondaryBackground.toString()
                : background.toString(),
            boxShadow:
              element.tabs.length > 1
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
                <Control />
              </div>
            ) : null}
            <div className="flex h-full flex-1 overflow-hidden">
              <TabsPremitives.List className="flex flex-1 flex-nowrap items-center overflow-hidden">
                {element.tabs.map((tab) => {
                  const selected = selectedTabId === tab.id;
                  return (
                    <div
                      key={tab.id}
                      className="group/tab relative flex h-full flex-1 overflow-hidden"
                    >
                      <TabsPremitives.Trigger
                        value={tab.id}
                        className={cn(
                          "h-full flex-1 overflow-hidden truncate px-3 text-center text-sm font-medium hover:bg-red-50",
                        )}
                        style={{
                          backgroundColor: selected
                            ? theme.settings.background
                            : "transparent",
                          boxShadow:
                            selected && element.tabs.length > 1
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
                      >
                        {tab.name || "Untitled"}
                      </TabsPremitives.Trigger>
                      {!readOnly && element.tabs.length > 1 && (
                        <button
                          className="pointer-events-none absolute right-1 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full opacity-0 transition-opacity hover:bg-secondary group-hover/tab:pointer-events-auto group-hover/tab:opacity-100"
                          onClick={() => handleRemoveTab(tab.id)}
                          css={{
                            ":hover": {
                              backgroundColor: secondaryBackground2.toString(),
                            },
                          }}
                        >
                          <XIcon className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </TabsPremitives.List>

              {!readOnly && element.tabs.length < MAX_TABS && (
                <button
                  className="flex h-full w-6 flex-shrink-0 items-center justify-center"
                  onClick={handleAddNewTab}
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
      ) : (
        <div
          data-cti-element-id={element.id}
          className="cti-drag-handle absolute left-0 right-0 top-0 z-10 h-4"
        />
      )}

      {element.tabs.map((tab) => (
        <TabsPremitives.Content
          key={tab.id}
          value={tab.id}
          className="overflow-hidden"
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
        </TabsPremitives.Content>
      ))}
    </TabsPremitives.Root>
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

"use client";

import { useCallback, useMemo } from "react";
import { langNames } from "@uiw/codemirror-extensions-langs";
import { ALargeSmallIcon, ListOrderedIcon, SpaceIcon } from "lucide-react";
import { useStore } from "zustand";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { CODE_EDITOR_THEMES } from "@/lib/constants/code-editor-themes";
import { CodeEditorTab, iCodeEditorElement } from "@/lib/validator/elements";
import { TITLE_BAR_CONTROLS } from "../../elements/code-editor/controls";
import { useSnippetEditor } from "../../snippet-editor";

import { NumberField, Padding, SwitchField, ToggleGroupField } from "./fields";

export default function CodeEditorProperties({
  element,
}: {
  element: iCodeEditorElement;
}) {
  const { snippetStore, editorStore } = useSnippetEditor();
  const updateElement = useStore(snippetStore, (state) => state.updateElement);
  const selectedTabIds = useStore(editorStore, (state) => state.selectedTabIds);
  const selectedTab = useMemo(() => {
    const tabId = selectedTabIds[element.id];
    if (!tabId) {
      return null;
    }
    return element.tabs.find((tab) => tab.id === tabId) ?? null;
  }, [element.id, element.tabs, selectedTabIds]);

  const handleUpdateTab = useCallback(
    (tabId: string, updatedTab: Partial<CodeEditorTab>) => {
      updateElement(element.id, {
        tabs: element.tabs.map((tab) =>
          tab.id === tabId ? { ...tab, ...updatedTab } : tab,
        ),
      });
    },
    [element.id, element.tabs, updateElement],
  );

  return (
    <div>
      <div className="p-2">
        <p className="text-xs text-muted-foreground">Code Editor Properties</p>
      </div>
      <Separator />

      <div className="flex flex-col gap-2 px-2 py-2">
        <Label>Padding</Label>
        <Padding
          value={element.padding}
          onPaddingChange={(value) =>
            updateElement(element.id, { padding: value })
          }
        />
      </div>

      <div className="flex h-12 items-center justify-between gap-2 px-2">
        <Label htmlFor="theme">Theme</Label>
        <Select
          value={element.theme}
          onValueChange={(value) =>
            updateElement(element.id, {
              theme: value,
            })
          }
        >
          <SelectTrigger id="theme" className="w-fit gap-2">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CODE_EDITOR_THEMES.map((item) => (
              <SelectItem key={item.id} value={item.id}>
                {item.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <NumberField
        label="Font Size"
        icon={<ALargeSmallIcon />}
        min={8}
        max={128}
        value={element.fontSize}
        onValueChange={(fontSize) => updateElement(element.id, { fontSize })}
      />

      <NumberField
        label="Tab Size"
        icon={<SpaceIcon />}
        min={2}
        value={element.tabSize}
        onValueChange={(tabSize) => updateElement(element.id, { tabSize })}
      />

      <SwitchField
        label="Show Line Numbers"
        checked={element.showLineNumbers}
        onCheckedChange={(lineNumbers) =>
          updateElement(element.id, { showLineNumbers: lineNumbers })
        }
      />

      {element.showLineNumbers && (
        <>
          <NumberField
            label="First Line Number"
            icon={<ListOrderedIcon />}
            min={1}
            value={element.lineNumbersStartFrom}
            onValueChange={(lineNumbersStartFrom) =>
              updateElement(element.id, { lineNumbersStartFrom })
            }
          />
        </>
      )}

      <SwitchField
        label="Show Title Bar"
        checked={element.showTitleBar}
        onCheckedChange={(titleBar) =>
          updateElement(element.id, { showTitleBar: titleBar })
        }
      />

      {element.showTitleBar && (
        <>
          <ToggleGroupField
            label="Control Position"
            options={[
              { value: "left", label: "Left" },
              { value: "right", label: "Right" },
            ]}
            value={element.titleBarControlPosition}
            onValueChange={(position) =>
              updateElement(element.id, {
                titleBarControlPosition: position as "left" | "right",
              })
            }
          />

          <div className="flex h-12 items-center justify-between gap-2 px-2">
            <Label htmlFor="control-style">Control Style</Label>
            <Select
              value={element.titleBarControlStyle}
              onValueChange={(value) =>
                updateElement(element.id, {
                  titleBarControlStyle: value,
                })
              }
            >
              <SelectTrigger className="w-fit gap-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TITLE_BAR_CONTROLS.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    <div className="flex h-6 items-center">
                      {item.Control ? (
                        <item.Control />
                      ) : (
                        <p className="text-muted-foreground">No Control</p>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </>
      )}

      {selectedTab && (
        <>
          <div className="p-2">
            <p className="text-xs text-muted-foreground">Selected Tab</p>
          </div>
          <Separator />
          <div className="flex h-12 items-center justify-between gap-2 px-2">
            <Label htmlFor="control-style">Tab Name</Label>
            <Input
              key={selectedTab.id}
              defaultValue={selectedTab.name}
              placeholder="Untitled"
              className="w-32"
              onChange={(e) => {
                handleUpdateTab(selectedTab.id, {
                  name: e.currentTarget.value,
                });
              }}
            />
          </div>
          <div className="flex h-12 items-center justify-between gap-2 px-2">
            <Label htmlFor="control-style">Language</Label>
            <Select
              key={selectedTab.id}
              defaultValue={selectedTab.language}
              onValueChange={(value) => {
                handleUpdateTab(selectedTab.id, {
                  language: value as CodeEditorTab["language"],
                });
              }}
            >
              <SelectTrigger className="w-32 gap-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {langNames.map((langName) => (
                  <SelectItem key={langName} value={langName}>
                    <div className="flex h-6 items-center">{langName}</div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </>
      )}
    </div>
  );
}

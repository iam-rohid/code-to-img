"use client";

import { langNames } from "@uiw/codemirror-extensions-langs";
import { ALargeSmallIcon, ListOrderedIcon, SpaceIcon } from "lucide-react";
import { useStore } from "zustand";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { iCodeEditorElement } from "@/lib/validator/element";
import { TITLE_BAR_CONTROLS } from "../../elements/code-editor/controls";
import { useSnippetEditor } from "../../snippet-editor";

import { NumberField, Padding, SwitchField, ToggleGroupField } from "./fields";

export default function CodeEditorProperties({
  element,
}: {
  element: iCodeEditorElement;
}) {
  const { snippetStore } = useSnippetEditor();
  const updateElement = useStore(snippetStore, (state) => state.updateElement);

  return (
    <>
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
        <Label htmlFor="control-style">Language</Label>
        <Select
          value={element.language}
          onValueChange={(value) =>
            updateElement(element.id, {
              language: value as iCodeEditorElement["language"],
            })
          }
        >
          <SelectTrigger className="w-fit gap-2">
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
    </>
  );
}

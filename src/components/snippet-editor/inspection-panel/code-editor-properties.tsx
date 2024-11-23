"use client";

import { useId } from "react";
import { useStore } from "zustand";

import { InspectorNumberInput } from "@/components/inspector-number-input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { iCodeEditorElement } from "@/lib/validator/element";
import { TITLE_BAR_CONTROLS } from "../elements/code-editor/controls";
import { useSnippetEditor } from "../snippet-editor";

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

      <SwitchField
        label="Show Line Numbers"
        checked={element.showLineNumbers}
        onCheckedChange={(lineNumbers) =>
          updateElement(element.id, { showLineNumbers: lineNumbers })
        }
      />

      <NumberField
        label="First Line Number"
        value={element.lineNumbersStartFrom}
        onValueChange={(lineNumbersStartFrom) =>
          updateElement(element.id, { lineNumbersStartFrom })
        }
      />

      <SwitchField
        label="Show Title Bar"
        checked={element.showTitleBar}
        onCheckedChange={(titleBar) =>
          updateElement(element.id, { showTitleBar: titleBar })
        }
      />

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
  );
}

function SwitchField({
  checked,
  label,
  onCheckedChange,
}: {
  label: string;
  checked: boolean;
  onCheckedChange?: (value: boolean) => void;
}) {
  const id = useId();

  return (
    <div className="flex h-12 items-center justify-between gap-2 px-2">
      <Label htmlFor={id}>{label}</Label>
      <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}

function ToggleGroupField({
  label,
  value,
  onValueChange,
  options,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onValueChange?: (value: string) => void;
}) {
  const id = useId();

  return (
    <div className="flex h-12 items-center justify-between gap-2 px-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="flex h-10 gap-0.5 rounded-lg border p-0.5">
        {options.map((option) => (
          <Button
            variant="ghost"
            key={option.value}
            className={cn("h-full rounded-sm px-3", {
              "bg-accent text-accent-foreground": option.value === value,
            })}
            onClick={() => onValueChange?.(option.value)}
          >
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  );
}

function NumberField({
  label,
  value,
  onValueChange,
}: {
  label: string;
  value: number;
  onValueChange?: (value: number) => void;
}) {
  const id = useId();

  return (
    <div className="grid h-12 grid-cols-[1fr,6rem] items-center gap-2 px-2">
      <Label htmlFor={id}>{label}</Label>
      <InspectorNumberInput
        id={id}
        min={1}
        icon={<span>N</span>}
        value={value}
        onValueChange={onValueChange}
      />
    </div>
  );
}

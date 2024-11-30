import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  ArrowDownToLine,
  ArrowUpToLine,
  FoldVertical,
} from "lucide-react";
import { useStore } from "zustand";

import BackgroundPicker, {
  SolidColorPicker,
} from "@/components/background-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { iTextElement } from "@/lib/validator/elements";
import { useSnippetEditor } from "../../snippet-editor";

import { BoxShadowField, NumberField, Padding, SwitchField } from "./fields";

const horizontalAlignmentOptions = [
  { label: "Align left", icon: <AlignLeft />, value: "start" },
  { label: "Align center", icon: <AlignCenter />, value: "center" },
  { label: "Align right", icon: <AlignRight />, value: "end" },
];

const verticalAlignmentOptions = [
  { label: "Align top", icon: <ArrowUpToLine />, value: "start" },
  {
    label: "Align middle",
    icon: <FoldVertical />,
    value: "center",
  },
  {
    label: "Align bottom",
    icon: <ArrowDownToLine />,
    value: "end",
  },
];

export function TextElementProperties({ element }: { element: iTextElement }) {
  const { snippetStore } = useSnippetEditor();
  const updateElement = useStore(snippetStore, (state) => state.updateElement);

  return (
    <div>
      <div className="flex flex-col gap-2 px-2 py-2">
        <Label>Padding</Label>
        <Padding
          value={element.padding}
          onPaddingChange={(value) =>
            updateElement(element.id, { padding: value })
          }
        />
      </div>

      <BoxShadowField
        value={element.boxShadow}
        onValueChange={(value) =>
          updateElement(element.id, { boxShadow: value })
        }
      />

      <div className="p-2">
        <p className="mb-2 text-xs text-muted-foreground">Text</p>
        <Textarea
          value={element.text}
          onChange={(e) => {
            updateElement(element.id, {
              text: e.currentTarget.value,
            });
          }}
          className="h-fit min-h-0 resize-none"
          rows={2}
        />
      </div>

      <div className="p-2">
        <p className="mb-2 text-xs text-muted-foreground">Background</p>
        <BackgroundPicker
          color={element.background.color}
          onColorChange={(color) =>
            updateElement(element.id, {
              background: { ...element.background, color },
            })
          }
        />
      </div>
      <div className="p-2">
        <p className="mb-2 text-xs text-muted-foreground">Foreground</p>
        <SolidColorPicker
          color={element.foregrounnd}
          onColorChange={(color) =>
            updateElement(element.id, {
              foregrounnd: color,
            })
          }
        />
      </div>

      <NumberField
        icon={<>FS</>}
        label="Font Size"
        value={element.fontSize}
        min={12}
        max={128}
        onValueChange={(fontSize) => {
          updateElement(element.id, {
            fontSize,
          });
        }}
      />

      <SwitchField
        label="Text Shadow"
        checked={element.textShadow}
        onCheckedChange={(textShadow) =>
          updateElement(element.id, { textShadow })
        }
      />

      <div className="p-2">
        <p className="mb-2 text-xs text-muted-foreground">Font Weight</p>
        <Input
          value={element.fontWeight ?? ""}
          onChange={(e) => {
            updateElement(element.id, {
              fontWeight: e.currentTarget.value,
            });
          }}
        />
      </div>

      <div className="p-2">
        <p className="mb-2 text-xs text-muted-foreground">Font Family</p>
        <Input
          value={element.fontFamily ?? ""}
          onChange={(e) => {
            updateElement(element.id, {
              fontFamily: e.currentTarget.value,
            });
          }}
        />
      </div>

      <NumberField
        icon={<>LS</>}
        label="Letter Spacing"
        value={element.letterSpacing}
        min={0}
        onValueChange={(letterSpacing) => {
          updateElement(element.id, {
            letterSpacing,
          });
        }}
      />

      <NumberField
        icon={<>LH</>}
        label="Line Height"
        value={element.lineHeight}
        min={0}
        onValueChange={(lineHeight) => {
          updateElement(element.id, {
            lineHeight,
          });
        }}
      />
      <NumberField
        icon={<>BR</>}
        label="Border Radius"
        value={element.borderRadius}
        min={0}
        onValueChange={(borderRadius) => {
          updateElement(element.id, {
            borderRadius,
          });
        }}
      />
      {/* <ToggleGroupField
        label="Horizontal Alignment"
        value={element.horizontalAlignment}
        options={[
          { label: "Align left", icon: <AlignLeft />, value: "start" },
          { label: "Align center", icon: <AlignCenter />, value: "center" },
          { label: "Align right", icon: <AlignRight />, value: "end" },
        ]}
        onValueChange={(value) =>
          updateElement(element.id, {
            horizontalAlignment: value as iTextElement["horizontalAlignment"],
          })
        }
      />
      <ToggleGroupField
        label="Vertical Alignment"
        value={element.verticalAlignment}
        options={[
          { label: "Align top", icon: <ArrowUpToLine />, value: "start" },
          { label: "Align middle", icon: <FoldVertical />, value: "center" },
          { label: "Align bottom", icon: <ArrowDownToLine />, value: "end" },
        ]}
        onValueChange={(value) =>
          updateElement(element.id, {
            verticalAlignment: value as iTextElement["verticalAlignment"],
          })
        }
      /> */}

      <div className="p-2">
        <p className="mb-2 text-xs text-muted-foreground">Alignment</p>
        <div className="flex gap-2">
          <div className="flex h-10 flex-1 gap-0.5 rounded-lg border p-0.5">
            {horizontalAlignmentOptions.map((option) => (
              <Button
                variant="ghost"
                key={option.value}
                className={cn("h-full flex-1 rounded-sm", {
                  "bg-accent text-accent-foreground":
                    option.value === element.horizontalAlignment,
                  "px-3": !option.icon,
                  "w-9": option.icon,
                })}
                onClick={() =>
                  updateElement(element.id, {
                    horizontalAlignment:
                      option.value as iTextElement["verticalAlignment"],
                  })
                }
                title={option.label}
              >
                {option.icon ?? option.label}
                {option.icon && <p className="sr-only">{option.label}</p>}
              </Button>
            ))}
          </div>
          <div className="flex h-10 flex-1 gap-0.5 rounded-lg border p-0.5">
            {verticalAlignmentOptions.map((option) => (
              <Button
                variant="ghost"
                key={option.value}
                className={cn("h-full flex-1 rounded-sm", {
                  "bg-accent text-accent-foreground":
                    option.value === element.verticalAlignment,
                  "px-3": !option.icon,
                  "w-9": option.icon,
                })}
                onClick={() =>
                  updateElement(element.id, {
                    verticalAlignment:
                      option.value as iTextElement["verticalAlignment"],
                  })
                }
                title={option.label}
              >
                {option.icon ?? option.label}
                {option.icon && <p className="sr-only">{option.label}</p>}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

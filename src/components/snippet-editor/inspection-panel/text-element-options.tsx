import { useStore } from "zustand";

import { InspectorNumberInput } from "@/components/inspector-number-input";
import { Input } from "@/components/ui/input";
import { iTextElement } from "@/lib/validator/element";
import { useEditor } from "../editor";

export function TextElementOptions({ element }: { element: iTextElement }) {
  const { store } = useEditor();
  const updateElement = useStore(store, (state) => state.updateElement);

  if (element?.type !== "text") {
    return null;
  }

  return (
    <>
      <div className="p-2">
        <p className="mb-2 text-xs text-muted-foreground">Text</p>
        <Input
          value={element.text}
          onChange={(e) => {
            updateElement(element.id, {
              text: e.currentTarget.value,
            });
          }}
        />
      </div>
      <div className="p-2">
        <p className="mb-2 text-xs text-muted-foreground">Font Size</p>
        <InspectorNumberInput
          icon={<>FS</>}
          value={element.fontSize ?? 16}
          onValueChange={(fontSize) => {
            updateElement(element.id, {
              fontSize,
            });
          }}
        />
      </div>

      <div className="p-2">
        <p className="mb-2 text-xs text-muted-foreground">Text Color</p>
        <Input
          value={element.foregrounnd}
          onChange={(e) => {
            updateElement(element.id, {
              foregrounnd: e.currentTarget.value,
            });
          }}
        />
      </div>
      {/* <div className="p-2">
        <p className="mb-2 text-xs text-muted-foreground">Background Color</p>
        <Input
          value={element.background ?? ""}
          onChange={(e) => {
            updateElement({
              ...element,
              backgroundColor: e.currentTarget.value,
            });
          }}
        />
      </div> */}
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
      <div className="p-2">
        <p className="mb-2 text-xs text-muted-foreground">Letter Spacing</p>
        <InspectorNumberInput
          icon={<>L</>}
          value={element.letterSpacing ?? 1}
          onValueChange={(letterSpacing) => {
            updateElement(element.id, {
              letterSpacing,
            });
          }}
        />
      </div>
      <div className="p-2">
        <p className="mb-2 text-xs text-muted-foreground">Line Height</p>
        <InspectorNumberInput
          icon={<>L</>}
          min={0}
          value={element.lineHeight ?? 1}
          onValueChange={(lineHeight) => {
            updateElement(element.id, {
              lineHeight,
            });
          }}
        />
      </div>
    </>
  );
}

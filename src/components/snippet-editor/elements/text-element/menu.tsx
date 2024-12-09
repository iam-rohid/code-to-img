import { Editor } from "@tiptap/react";
import {
  AlignCenterIcon,
  AlignLeftIcon,
  AlignRightIcon,
  ListIcon,
  ListOrderedIcon,
  Redo2Icon,
  Undo2Icon,
} from "lucide-react";
import { createPortal } from "react-dom";

import { SolidColorPicker } from "@/components/background-picker";
import { InspectorNumberInput } from "@/components/inspector-number-input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { iPadding } from "@/lib/validator/elements";

export default function Menu({
  editor,
  padding,
}: {
  editor: Editor;
  padding: iPadding;
}) {
  return createPortal(
    <div
      className="fixed -top-48 flex h-10 -translate-x-1/2 items-center gap-px rounded-lg border bg-card p-[3px] text-card-foreground shadow-md"
      style={{
        left:
          editor.view.dom.getBoundingClientRect().x -
          padding.left +
          (editor.view.dom.getBoundingClientRect().width +
            padding.left +
            padding.right) /
            2,
        top: editor.view.dom.getBoundingClientRect().y - padding.top - 48,
      }}
    >
      <Button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={cn("h-8 w-8 font-bold text-muted-foreground", {
          "bg-accent text-accent-foreground": editor.isActive("bold"),
        })}
        size="icon"
        variant="ghost"
        type="button"
      >
        B
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={cn("h-8 w-8 italic text-muted-foreground", {
          "bg-accent text-accent-foreground": editor.isActive("italic"),
        })}
        size="icon"
        variant="ghost"
        type="button"
      >
        I
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={cn("h-8 w-8 text-muted-foreground underline", {
          "bg-accent text-accent-foreground": editor.isActive("underline"),
        })}
        size="icon"
        variant="ghost"
        type="button"
      >
        U
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={cn("h-8 w-8 text-muted-foreground line-through", {
          "bg-accent text-accent-foreground": editor.isActive("strike"),
        })}
        size="icon"
        variant="ghost"
        type="button"
      >
        S
      </Button>
      <Separator orientation="vertical" className="mx-0.5 h-6" />
      <Button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={cn("h-8 w-8 text-muted-foreground", {
          "bg-accent text-accent-foreground": editor.isActive("bulletList"),
        })}
        size="icon"
        variant="ghost"
        type="button"
      >
        <ListIcon />
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={cn("h-8 w-8 text-muted-foreground", {
          "bg-accent text-accent-foreground": editor.isActive("orderedList"),
        })}
        size="icon"
        variant="ghost"
        type="button"
      >
        <ListOrderedIcon />
      </Button>
      <Separator orientation="vertical" className="mx-0.5 h-6" />
      <Button
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        className={cn("h-8 w-8 text-muted-foreground", {
          "bg-accent text-accent-foreground": editor.isActive({
            textAlign: "left",
          }),
        })}
        size="icon"
        variant="ghost"
        type="button"
      >
        <AlignLeftIcon />
      </Button>
      <Button
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        className={cn("h-8 w-8 text-muted-foreground", {
          "bg-accent text-accent-foreground": editor.isActive({
            textAlign: "center",
          }),
        })}
        size="icon"
        variant="ghost"
        type="button"
      >
        <AlignCenterIcon />
      </Button>
      <Button
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        className={cn("h-8 w-8 text-muted-foreground", {
          "bg-accent text-accent-foreground": editor.isActive({
            textAlign: "right",
          }),
        })}
        size="icon"
        variant="ghost"
        type="button"
      >
        <AlignRightIcon />
      </Button>
      <Separator orientation="vertical" className="mx-0.5 h-6" />

      <SolidColorPicker
        color={editor.getAttributes("textStyle").color}
        onColorChange={(color) => editor.chain().setColor(color).run()}
        className="h-8 w-20"
      />

      <InspectorNumberInput
        value={editor.getAttributes("textStyle").fontSize}
        min={12}
        max={128}
        icon={<>T</>}
        onValueChange={(value) => {
          editor.chain().setFontSize(value).run();
        }}
        className="h-8 w-20"
      />

      <Separator orientation="vertical" className="mx-0.5 h-6" />

      <Button
        onClick={() => editor.chain().focus().undo().run()}
        className={cn("h-8 w-8 text-muted-foreground")}
        size="icon"
        variant="ghost"
        type="button"
        disabled={!editor.can().undo()}
      >
        <Undo2Icon />
      </Button>
      <Button
        onClick={() => editor.chain().focus().redo().run()}
        className={cn("h-8 w-8 text-muted-foreground")}
        size="icon"
        variant="ghost"
        type="button"
        disabled={!editor.can().redo()}
      >
        <Redo2Icon />
      </Button>
    </div>,
    document.body,
  );
}

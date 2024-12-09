import { useCallback } from "react";
import {
  AppWindowMacIcon,
  ArrowRightIcon,
  CircleIcon,
  HexagonIcon,
  ImageIcon,
  ShapesIcon,
  SquareIcon,
  TypeIcon,
} from "lucide-react";
import { nanoid } from "nanoid";
import { useStore } from "zustand";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  getCodeEditorElement,
  getImageElement,
  getTextElement,
} from "@/lib/constants/elements";
import { getEditor } from "@/lib/tiptap";
import { getCenterXYForElement } from "@/lib/utils";
import { iElement } from "@/lib/validator/elements";
import { useImagePickerModal } from "../image-picker-modal";
import { useSnippetEditor } from "../snippet-editor";

export default function Toolbar() {
  const { snippetStore, editorStore } = useSnippetEditor();
  const addElement = useStore(snippetStore, (state) => state.addElement);
  const setSelectedElement = useStore(
    editorStore,
    (state) => state.setSelectedElement,
  );
  const setTipTapEditor = useStore(
    editorStore,
    (state) => state.setTipTapEditor,
  );
  const canvasWidth = useStore(snippetStore, (state) => state.width);
  const canvasHeight = useStore(snippetStore, (state) => state.height);
  const [ImagePickerModal, , setImagePickerModalOpen] = useImagePickerModal();

  const handleAddElement = useCallback(
    (element: iElement) => {
      addElement(element);
      setSelectedElement(element.id);
      if (element.type === "text") {
        setTipTapEditor(element.id, getEditor(element));
      }
    },
    [addElement, setSelectedElement, setTipTapEditor],
  );

  return (
    <div className="pointer-events-auto flex items-center gap-1 rounded-lg border bg-card p-0.5 text-card-foreground shadow-md">
      <Button
        size="icon"
        variant="ghost"
        onClick={() => {
          handleAddElement(
            getCodeEditorElement({
              id: nanoid(),
              width: 400,
              height: 93,
              ...getCenterXYForElement({
                canvasHeight,
                canvasWidth,
                width: 400,
                height: 93,
              }),
            }),
          );
        }}
      >
        <AppWindowMacIcon />
      </Button>
      <Button
        size="icon"
        variant="ghost"
        onClick={() => {
          handleAddElement(
            getTextElement({
              id: nanoid(),
              width: 72,
              height: 44,
              ...getCenterXYForElement({
                canvasHeight,
                canvasWidth,
                width: 72,
                height: 44,
              }),
            }),
          );
        }}
      >
        <TypeIcon />
      </Button>
      <Button
        size="icon"
        variant="ghost"
        onClick={() => setImagePickerModalOpen(true)}
      >
        <ImageIcon />
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" variant="ghost">
            <ShapesIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="bottom" align="end">
          <DropdownMenuItem>
            <SquareIcon />
            Rectangle
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CircleIcon />
            Ellipse
          </DropdownMenuItem>
          <DropdownMenuItem>
            <HexagonIcon />
            Polygon
          </DropdownMenuItem>
          <DropdownMenuItem>
            <ArrowRightIcon />
            Arrow
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ImagePickerModal
        onPick={(image) => {
          const { height, width } = reduceSize(image.width, image.height, 256);
          handleAddElement(
            getImageElement({
              id: nanoid(),
              image,
              name: image.name ? `${image.name} - Image` : "Image",
              height,
              width,
              widthHeightLinked: true,
              ...getCenterXYForElement({
                canvasHeight,
                canvasWidth,
                width,
                height,
              }),
            }),
          );
        }}
      />
    </div>
  );
}

function reduceSize(width: number, height: number, size: number) {
  if (Math.max(width, height) < size) {
    return { width, height };
  } else if (width === height) {
    return { width: size, height: size };
  } else if (width > height) {
    const newWidth = size;
    const newHeight = (width * newWidth) / height;
    return { width: newWidth, height: newHeight };
  } else {
    const newHeight = size;
    const newWidth = (height * newHeight) / width;
    return { width: newWidth, height: newHeight };
  }
}

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
import { getCodeEditorElement, getTextElement } from "@/lib/constants/elements";
import { iElement } from "@/lib/validator/element";
import { useSnippetEditor } from "../snippet-editor";

export default function Toolbar() {
  const { snippetStore, editorStore } = useSnippetEditor();
  const addElement = useStore(snippetStore, (state) => state.addElement);
  const setSelectedElement = useStore(
    editorStore,
    (state) => state.setSelectedElement,
  );
  const canvasWidth = useStore(snippetStore, (state) => state.transform.width);
  const canvasHeight = useStore(
    snippetStore,
    (state) => state.transform.height,
  );

  const handleAddElement = useCallback(
    (element: iElement) => {
      addElement(element);
      setSelectedElement(element.id);
    },
    [addElement, setSelectedElement],
  );

  return (
    <div className="pointer-events-auto flex items-center gap-1 rounded-lg border bg-card p-0.5 text-card-foreground shadow-md">
      <Button
        size="icon"
        variant="ghost"
        onClick={() => {
          handleAddElement(
            getCodeEditorElement({ id: nanoid(), canvasWidth, canvasHeight }),
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
            getTextElement({ id: nanoid(), canvasWidth, canvasHeight }),
          );
        }}
      >
        <TypeIcon />
      </Button>
      <Button size="icon" variant="ghost">
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
    </div>
  );
}

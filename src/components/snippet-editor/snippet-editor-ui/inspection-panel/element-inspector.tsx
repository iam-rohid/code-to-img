import { memo } from "react";
import {
  AlignHorizontalJustifyCenterIcon,
  AlignHorizontalJustifyEndIcon,
  AlignHorizontalJustifyStartIcon,
  AlignVerticalJustifyCenterIcon,
  AlignVerticalJustifyEndIcon,
  AlignVerticalJustifyStartIcon,
  CopyPlusIcon,
  Link2Icon,
  MoveHorizontalIcon,
  MoveIcon,
  MoveVerticalIcon,
  RotateCcwIcon,
  RulerIcon,
  TrashIcon,
  Unlink2Icon,
} from "lucide-react";
import { useStore } from "zustand";

import { InspectorNumberInput } from "@/components/inspector-number-input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getEditor } from "@/lib/tiptap";
import { cn } from "@/lib/utils";
import { iElement } from "@/lib/validator/elements";
import { useSnippetEditor } from "../../snippet-editor";

import CodeEditorProperties from "./code-editor-properties";
import { TextElementProperties } from "./text-element-properties";

function ElementInspector({ elementId }: { elementId: string }) {
  const { snippetStore } = useSnippetEditor();
  const element = useStore(snippetStore, (state) =>
    state.elements.find((element) => element.id === elementId),
  );
  if (!element) {
    return null;
  }

  return (
    <div className="bg-card text-card-foreground pointer-events-auto flex h-fit max-h-full w-72 flex-col overflow-y-auto rounded-lg border shadow-sm">
      <ElementAlignment element={element} />
      <Separator />
      <ElementTransformProperties element={element} />
      {element.type === "text" ? (
        <>
          <Separator />
          <TextElementProperties element={element} />
        </>
      ) : element.type === "code-editor" ? (
        <>
          <Separator />
          <CodeEditorProperties element={element} />
        </>
      ) : null}
      <Separator />
      <ElementActions element={element} />
    </div>
  );
}

export const ElementInspectorMemo = memo(ElementInspector);

function ElementAlignment({ element }: { element: iElement }) {
  const { snippetStore } = useSnippetEditor();
  const alignElement = useStore(snippetStore, (state) => state.alignElement);
  return (
    <div className="p-2">
      <p className="text-muted-foreground mb-2 text-xs">Alignment</p>
      <div className="flex items-center justify-between">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => alignElement(element.id, "start-horizontal")}
            >
              <AlignHorizontalJustifyStartIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Align left</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => alignElement(element.id, "center-horizontal")}
            >
              <AlignHorizontalJustifyCenterIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Align horizontally center</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => alignElement(element.id, "end-horizontal")}
            >
              <AlignHorizontalJustifyEndIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Align right</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => alignElement(element.id, "start-vertical")}
            >
              <AlignVerticalJustifyStartIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Align top</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => alignElement(element.id, "center-vertical")}
            >
              <AlignVerticalJustifyCenterIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Align vertically center</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => alignElement(element.id, "end-vertical")}
            >
              <AlignVerticalJustifyEndIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Align bottom</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}

const AUTO_SIZE_SPPORTED_ELEMENTS: iElement["type"][] = ["code-editor", "text"];

function ElementTransformProperties({ element }: { element: iElement }) {
  const { snippetStore } = useSnippetEditor();
  const updateElementTransform = useStore(
    snippetStore,
    (state) => state.updateElement,
  );

  return (
    <div className="p-2">
      <p className="text-muted-foreground mb-2 text-xs">Transform</p>
      <div className="grid grid-cols-[1fr_24px_1fr_24px] items-center gap-x-1 gap-y-2">
        <InspectorNumberInput
          value={element.x}
          icon={<span>X</span>}
          onValueChange={(value) => {
            updateElementTransform(element.id, { x: value });
          }}
        />
        <div></div>
        <InspectorNumberInput
          value={element.y}
          icon={<span>Y</span>}
          onValueChange={(value) => {
            updateElementTransform(element.id, { y: value });
          }}
        />
        <div></div>
        <InspectorNumberInput
          value={element.width}
          min={20}
          icon={<span>W</span>}
          disabled={element.autoWidth}
          onValueChange={(value) => {
            let width = value;
            let height = element.height;
            if (element.widthHeightLinked) {
              height = (element.height * width) / element.width;
            }
            if (height < 20) {
              width = (width * 20) / height;
              height = 20;
            }
            updateElementTransform(element.id, { width, height });
          }}
        />
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="outline"
              className={cn("h-6 w-6", {
                "bg-secondary": element.widthHeightLinked,
              })}
              onClick={() =>
                updateElementTransform(element.id, {
                  widthHeightLinked: !element.widthHeightLinked,
                })
              }
              disabled={element.autoHeight || element.autoWidth}
            >
              {element.widthHeightLinked ? <Link2Icon /> : <Unlink2Icon />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>Link width height</TooltipContent>
        </Tooltip>
        {/* {AUTO_WIDTH_SPPORTED_ELEMENTS.includes(element.type) ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="outline"
                className={cn("h-6 w-6", {
                  "bg-secondary": element.autoWidth,
                })}
                onClick={() =>
                  updateElementTransform(element.id, {
                    autoWidth: !element.autoWidth,
                  })
                }
              >
                <MoveHorizontalIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Auto width</TooltipContent>
          </Tooltip>
        ) : (
          <div />
        )} */}
        <InspectorNumberInput
          value={element.height}
          min={20}
          icon={<span>H</span>}
          onValueChange={(value) => {
            let height = value;
            let width = element.width;
            if (element.widthHeightLinked) {
              width = (element.width * height) / element.height;
            }
            if (width < 20) {
              height = (height * 20) / width;
              width = 20;
            }
            updateElementTransform(element.id, { height, width });
          }}
          disabled={element.autoHeight}
        />

        {AUTO_SIZE_SPPORTED_ELEMENTS.includes(element.type) ? (
          <Tooltip>
            <DropdownMenu>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button size="icon" variant="outline" className="h-6 w-6">
                    {element.autoHeight && element.autoWidth ? (
                      <MoveIcon />
                    ) : element.autoHeight ? (
                      <MoveVerticalIcon />
                    ) : element.autoWidth ? (
                      <MoveHorizontalIcon />
                    ) : (
                      <RulerIcon />
                    )}
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  onClick={() =>
                    updateElementTransform(element.id, {
                      autoWidth: true,
                      autoHeight: true,
                      widthHeightLinked: false,
                    })
                  }
                  className={cn({
                    "bg-accent text-accent-foreground":
                      element.autoHeight && element.autoWidth,
                  })}
                >
                  <MoveIcon />
                  Auto Size
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    updateElementTransform(element.id, {
                      autoWidth: true,
                      autoHeight: false,
                      widthHeightLinked: false,
                    })
                  }
                  className={cn({
                    "bg-accent text-accent-foreground":
                      !element.autoHeight && element.autoWidth,
                  })}
                >
                  <MoveHorizontalIcon />
                  Auto Width
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    updateElementTransform(element.id, {
                      autoHeight: true,
                      autoWidth: false,
                      widthHeightLinked: false,
                    })
                  }
                  className={cn({
                    "bg-accent text-accent-foreground":
                      element.autoHeight && !element.autoWidth,
                  })}
                >
                  <MoveVerticalIcon />
                  Auto Height
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    updateElementTransform(element.id, {
                      autoHeight: false,
                      autoWidth: false,
                    })
                  }
                  className={cn({
                    "bg-accent text-accent-foreground":
                      !element.autoHeight && !element.autoWidth,
                  })}
                >
                  <RulerIcon />
                  Fixed Size
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <TooltipContent>
              {element.autoHeight && element.autoWidth
                ? "Auto Size"
                : element.autoHeight
                  ? "Auto Height"
                  : element.autoWidth
                    ? "Auto Width"
                    : "Fixed Size"}
            </TooltipContent>
          </Tooltip>
        ) : (
          <div />
        )}
        <InspectorNumberInput
          value={element.rotation}
          icon={<span>R</span>}
          onValueChange={(value) => {
            updateElementTransform(element.id, {
              rotation: value,
            });
          }}
        />
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="outline"
              className="h-6 w-6"
              onClick={() => {
                updateElementTransform(element.id, {
                  rotation: 0,
                });
              }}
            >
              <RotateCcwIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Reset value</TooltipContent>
        </Tooltip>
        <InspectorNumberInput
          value={element.scale * 100}
          min={10}
          max={500}
          icon={<span>S</span>}
          onValueChange={(value) => {
            updateElementTransform(element.id, {
              scale: value / 100,
            });
          }}
        />
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="outline"
              className="h-6 w-6"
              onClick={() => {
                updateElementTransform(element.id, {
                  scale: 1,
                });
              }}
            >
              <RotateCcwIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Reset value</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}

function ElementActions({ element }: { element: iElement }) {
  const { snippetStore, editorStore } = useSnippetEditor();
  const removeElement = useStore(snippetStore, (state) => state.removeElement);
  const duplicateElement = useStore(
    snippetStore,
    (state) => state.duplicateElement,
  );
  const setTipTapEditor = useStore(
    editorStore,
    (state) => state.setTipTapEditor,
  );
  const setSelectedElement = useStore(
    editorStore,
    (state) => state.setSelectedElement,
  );

  return (
    <div className="p-2">
      <p className="text-muted-foreground mb-2 text-xs">Actions</p>
      <div className="flex items-center gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                const duplicatedElement = duplicateElement(element.id);
                if (duplicatedElement) {
                  if (duplicatedElement.type === "text") {
                    setTipTapEditor(
                      duplicatedElement.id,
                      getEditor(duplicatedElement),
                    );
                  }
                  setSelectedElement(duplicatedElement.id);
                }
              }}
            >
              <CopyPlusIcon />
              <span className="sr-only">Duplicate</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Duplicate</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeElement(element.id)}
            >
              <TrashIcon />
              <span className="sr-only">Delete</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Delete</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}

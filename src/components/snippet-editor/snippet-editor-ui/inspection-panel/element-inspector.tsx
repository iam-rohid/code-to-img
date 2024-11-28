import { memo } from "react";
import {
  AlignHorizontalJustifyCenterIcon,
  AlignHorizontalJustifyEndIcon,
  AlignHorizontalJustifyStartIcon,
  AlignVerticalJustifyCenterIcon,
  AlignVerticalJustifyEndIcon,
  AlignVerticalJustifyStartIcon,
  CopyIcon,
  MoveHorizontalIcon,
  MoveVerticalIcon,
  RotateCcwIcon,
  TrashIcon,
} from "lucide-react";
import { useStore } from "zustand";

import { InspectorNumberInput } from "@/components/inspector-number-input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
    <div className="pointer-events-auto flex h-fit max-h-full w-72 flex-col overflow-y-auto rounded-lg border bg-card text-card-foreground shadow-sm">
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
      <p className="mb-2 text-xs text-muted-foreground">Alignment</p>
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

function ElementTransformProperties({ element }: { element: iElement }) {
  const { snippetStore } = useSnippetEditor();
  const updateElementTransform = useStore(
    snippetStore,
    (state) => state.updateElement,
  );

  return (
    <div className="p-2">
      <p className="mb-2 text-xs text-muted-foreground">Transform</p>
      <div className="grid grid-cols-[1fr,24px,1fr,24px] items-center gap-x-1 gap-y-2">
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
            const width = value;
            let height = element.height;
            if (element.widthHeightLinked) {
              height = (element.height * width) / element.width;
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
        <InspectorNumberInput
          value={element.height}
          min={20}
          icon={<span>H</span>}
          onValueChange={(value) => {
            const height = value;
            let width = element.width;
            if (element.widthHeightLinked) {
              width = (element.width * height) / element.height;
            }
            updateElementTransform(element.id, { height, width });
          }}
          disabled={element.autoHeight}
        />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="outline"
              className={cn("h-6 w-6", {
                "bg-secondary": element.autoHeight,
              })}
              onClick={() =>
                updateElementTransform(element.id, {
                  autoHeight: !element.autoHeight,
                })
              }
            >
              <MoveVerticalIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Auto height</TooltipContent>
        </Tooltip>
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
  const setSelectedElement = useStore(
    editorStore,
    (state) => state.setSelectedElement,
  );

  return (
    <div className="p-2">
      <p className="mb-2 text-xs text-muted-foreground">Actions</p>
      <div className="flex items-center gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                const duplicatedElement = duplicateElement(element.id);
                if (duplicatedElement) {
                  setSelectedElement(duplicatedElement.id);
                }
              }}
            >
              <CopyIcon />
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

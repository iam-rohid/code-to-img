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

import { InspectorNumberInput } from "@/components/inspector-number-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { iTextElement } from "@/lib/validator/element";
import { iTransform } from "@/lib/validator/transform";
import { useSnippetStore } from "@/providers/snippet-store-provider";
import { useEditorStore } from "@/store/editor-store";

export default function InspectionPanel() {
  const selectedElementId = useEditorStore((state) => state.selectedElementId);

  if (selectedElementId === "canvas") {
    return <CanvasInspector />;
  }

  if (selectedElementId) {
    return <ElementInspectorMemo elementId={selectedElementId} />;
  }

  return null;
}

function CanvasInspector() {
  return (
    <div className="pointer-events-auto flex h-fit max-h-full w-72 flex-col overflow-y-auto rounded-lg border bg-background shadow-sm">
      <div className="p-2">
        <p className="text-sm font-medium text-muted-foreground">Canvas</p>
      </div>
      <Separator />
      <CanvasTransform />
    </div>
  );
}

export const InspectionPanelMemo = memo(InspectionPanel);

function CanvasTransform() {
  const canvasWidth = useSnippetStore((state) => state.transform.width);
  const canvasHeight = useSnippetStore((state) => state.transform.height);
  const canvasWidthHeightLinked = useSnippetStore(
    (state) => state.transform.widthHeightLinked,
  );
  const setCanvasTransform = useSnippetStore(
    (state) => state.updateSnippetTransform,
  );

  return (
    <div className="p-2">
      <p className="mb-2 text-xs text-muted-foreground">Transform</p>
      <div className="grid grid-cols-[1fr,24px,1fr,24px] items-center gap-x-1 gap-y-2">
        <InspectorNumberInput
          value={canvasWidth}
          min={200}
          icon={<span>W</span>}
          onValueChange={(value) => {
            const width = value;
            let height = canvasHeight;
            if (canvasWidthHeightLinked) {
              height = (canvasHeight * width) / canvasWidth;
            }
            setCanvasTransform({
              width,
              height,
            });
          }}
        />
        <div></div>
        {/* <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="icon"
            variant="outline"
            className="h-6 w-6"
            onClick={() =>
              setCanvas({
                widthHeightLinked: !canvasWidthHeightLinked,
              })
            }
          >
            {canvasWidthHeightLinked ? <Link2Icon /> : <Unlink2Icon />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>Maintain aspect ratio</TooltipContent>
      </Tooltip> */}
        <InspectorNumberInput
          value={canvasHeight}
          min={200}
          icon={<span>H</span>}
          onValueChange={(value) => {
            const height = value;
            let width = canvasWidth;
            if (canvasWidthHeightLinked) {
              width = (canvasWidth * height) / canvasHeight;
            }
            setCanvasTransform({
              height,
              width,
            });
          }}
        />
        <div></div>
      </div>
    </div>
  );
}

function ElementInspector({ elementId }: { elementId: string }) {
  const element = useSnippetStore((state) =>
    state.elements.find((element) => element.id === elementId),
  );
  if (!element) {
    return null;
  }

  return (
    <div className="pointer-events-auto flex h-fit max-h-full w-72 flex-col overflow-y-auto rounded-lg border bg-background shadow-sm">
      <ElementAlignment elementId={elementId} />
      <Separator />
      <ElementTransform elementId={elementId} transform={element.transform} />
      {element.type === "text" && (
        <>
          <Separator />
          <TextElementOptions element={element} />
        </>
      )}
      <Separator />
      <ElementActions elementId={elementId} />
    </div>
  );
}

const ElementInspectorMemo = memo(ElementInspector);

function ElementAlignment({ elementId }: { elementId: string }) {
  const alignElement = useSnippetStore((state) => state.alignElement);
  return (
    <div className="p-2">
      <p className="mb-2 text-xs text-muted-foreground">Alignment</p>
      <div className="flex items-center justify-between">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => alignElement(elementId, "start-horizontal")}
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
              onClick={() => alignElement(elementId, "center-horizontal")}
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
              onClick={() => alignElement(elementId, "end-horizontal")}
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
              onClick={() => alignElement(elementId, "start-vertical")}
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
              onClick={() => alignElement(elementId, "center-vertical")}
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
              onClick={() => alignElement(elementId, "end-vertical")}
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

function ElementTransform({
  elementId,
  transform,
}: {
  elementId: string;
  transform: iTransform;
}) {
  const updateElementTransform = useSnippetStore(
    (state) => state.updateElementTransform,
  );

  return (
    <div className="p-2">
      <p className="mb-2 text-xs text-muted-foreground">Transform</p>
      <div className="grid grid-cols-[1fr,24px,1fr,24px] items-center gap-x-1 gap-y-2">
        <InspectorNumberInput
          value={transform.position.x}
          icon={<span>X</span>}
          onValueChange={(value) => {
            updateElementTransform(elementId, {
              position: { ...transform.position, x: value },
            });
          }}
        />
        <div></div>
        <InspectorNumberInput
          value={transform.position.y}
          icon={<span>Y</span>}
          onValueChange={(value) => {
            updateElementTransform(elementId, {
              position: { ...transform.position, y: value },
            });
          }}
        />
        <div></div>
        <InspectorNumberInput
          value={transform.width}
          min={20}
          icon={<span>W</span>}
          onValueChange={(value) => {
            const width = value;
            let height = transform.height;
            if (transform.widthHeightLinked) {
              height = (transform.height * width) / transform.width;
            }
            updateElementTransform(elementId, { width, height });
          }}
        />
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="outline"
              className={cn("h-6 w-6", {
                "bg-secondary": transform.autoWidth,
              })}
              onClick={() =>
                updateElementTransform(elementId, {
                  autoWidth: !transform.autoWidth,
                })
              }
            >
              <MoveHorizontalIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Auto width</TooltipContent>
        </Tooltip>
        <InspectorNumberInput
          value={transform.height}
          min={20}
          icon={<span>H</span>}
          onValueChange={(value) => {
            const height = value;
            let width = transform.width;
            if (transform.widthHeightLinked) {
              width = (transform.width * height) / transform.height;
            }
            updateElementTransform(elementId, { height, width });
          }}
        />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="outline"
              className={cn("h-6 w-6", {
                "bg-secondary": transform.autoHeight,
              })}
              onClick={() =>
                updateElementTransform(elementId, {
                  autoHeight: !transform.autoHeight,
                })
              }
            >
              <MoveVerticalIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Auto height</TooltipContent>
        </Tooltip>
        <InspectorNumberInput
          value={transform.rotation}
          icon={<span>R</span>}
          onValueChange={(value) => {
            updateElementTransform(elementId, {
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
                updateElementTransform(elementId, {
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
          value={transform.scale * 100}
          min={10}
          max={200}
          icon={<span>S</span>}
          onValueChange={(value) => {
            updateElementTransform(elementId, {
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
                updateElementTransform(elementId, {
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

function ElementActions({ elementId }: { elementId: string }) {
  const removeElement = useSnippetStore((state) => state.removeElement);
  const duplicateElement = useSnippetStore((state) => state.duplicateElement);

  return (
    <div className="p-2">
      <p className="mb-2 text-xs text-muted-foreground">Actions</p>
      <div className="flex items-center gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => duplicateElement(elementId)}
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
              onClick={() => removeElement(elementId)}
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

function TextElementOptions({ element }: { element: iTextElement }) {
  const updateElement = useSnippetStore((state) => state.updateElement);

  if (element?.type !== "text") {
    return null;
  }

  return (
    <>
      <div className="p-2">
        <p className="mb-2 text-xs text-muted-foreground">Value</p>
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

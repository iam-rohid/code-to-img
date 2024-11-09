import { Button } from "@/components/ui/button";
import {
  AlignHorizontalJustifyCenterIcon,
  AlignHorizontalJustifyEndIcon,
  AlignHorizontalJustifyStartIcon,
  AlignVerticalJustifyCenterIcon,
  AlignVerticalJustifyEndIcon,
  AlignVerticalJustifyStartIcon,
  CopyIcon,
  RotateCcwIcon,
  TrashIcon,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useEditorStore } from "./store";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { InspectorNumberInput } from "@/components/inspector-number-input";
import { Input } from "@/components/ui/input";
import { iElement } from "./types";

export default function InspectionPanel() {
  const selectedElementId = useEditorStore((state) => state.selectedElementId);

  if (selectedElementId === "canvas") {
    return <CanvasInspector />;
  }

  if (selectedElementId) {
    return <ElementInspector elementId={selectedElementId} />;
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

function CanvasTransform() {
  const canvasWidth = useEditorStore((state) => state.canvas.width);
  const canvasHeight = useEditorStore((state) => state.canvas.height);
  const canvasWidthHeightLinked = useEditorStore(
    (state) => state.canvas.widthHeightLinked,
  );
  const setCanvas = useEditorStore((state) => state.setCanvas);

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
            setCanvas({
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
            setCanvas({
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
  const element = useEditorStore((state) =>
    state.canvas.elements.find((element) => element.id === elementId),
  );
  if (!element) {
    return null;
  }

  return (
    <div className="pointer-events-auto flex h-fit max-h-full w-72 flex-col overflow-y-auto rounded-lg border bg-background shadow-sm">
      <ElementAlignment elementId={elementId} />
      <Separator />
      <ElementTransform element={element} />
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

function ElementAlignment({ elementId }: { elementId: string }) {
  const alignElement = useEditorStore((state) => state.alignElement);
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

function ElementTransform({ element }: { element: iElement }) {
  const updateElement = useEditorStore((state) => state.updateElement);

  return (
    <div className="p-2">
      <p className="mb-2 text-xs text-muted-foreground">Transform</p>
      <div className="grid grid-cols-[1fr,24px,1fr,24px] items-center gap-x-1 gap-y-2">
        <InspectorNumberInput
          value={element.transform.position.x}
          icon={<span>X</span>}
          onValueChange={(value) => {
            updateElement({
              ...element,
              transform: {
                ...element.transform,
                position: { ...element.transform.position, x: value },
              },
            });
          }}
        />
        <div></div>
        <InspectorNumberInput
          value={element.transform.position.y}
          icon={<span>Y</span>}
          onValueChange={(value) => {
            updateElement({
              ...element,
              transform: {
                ...element.transform,
                position: { ...element.transform.position, y: value },
              },
            });
          }}
        />
        <div></div>
        <InspectorNumberInput
          value={element.transform.width}
          min={element.transform.minWidth}
          icon={<span>W</span>}
          onValueChange={(value) => {
            const width = value;
            let height = element.transform.height;
            if (element.transform.widthHeightLinked) {
              height =
                (element.transform.height * width) / element.transform.width;
            }
            updateElement({
              ...element,
              transform: {
                ...element.transform,
                width,
                height,
              },
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
                updateElement( {
                ...element,
                  transform: {
                    ...element.transform,
                    widthHeightLinked: !element.transform.widthHeightLinked,
                  },
                })
              }
            >
              {element.transform.widthHeightLinked ? <Link2Icon /> : <Unlink2Icon />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>Maintain aspect ratio</TooltipContent>
        </Tooltip> */}
        <InspectorNumberInput
          value={element.transform.height}
          min={element.transform.minHeight}
          icon={<span>H</span>}
          onValueChange={(value) => {
            const height = value;
            let width = element.transform.width;
            if (element.transform.widthHeightLinked) {
              width =
                (element.transform.width * height) / element.transform.height;
            }
            updateElement({
              ...element,
              transform: {
                ...element.transform,
                height,
                width,
              },
            });
          }}
        />
        <div></div>
        <InspectorNumberInput
          value={element.transform.rotation}
          icon={<span>R</span>}
          onValueChange={(value) => {
            updateElement({
              ...element,
              transform: {
                ...element.transform,
                rotation: value,
              },
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
                updateElement({
                  ...element,
                  transform: { ...element.transform, rotation: 0 },
                });
              }}
            >
              <RotateCcwIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Reset value</TooltipContent>
        </Tooltip>
        <InspectorNumberInput
          value={element.transform.scale * 100}
          min={10}
          max={200}
          icon={<span>S</span>}
          onValueChange={(value) => {
            updateElement({
              ...element,
              transform: {
                ...element.transform,
                scale: value / 100,
              },
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
                updateElement({
                  ...element,
                  transform: { ...element.transform, scale: 1 },
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
  const removeElement = useEditorStore((state) => state.removeElement);
  const duplicateElement = useEditorStore((state) => state.duplicateElement);

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

function TextElementOptions({ element }: { element: iElement }) {
  const updateElement = useEditorStore((state) => state.updateElement);

  if (element?.type !== "text") {
    return null;
  }

  return (
    <>
      <div className="p-2">
        <p className="mb-2 text-xs text-muted-foreground">Value</p>
        <Input
          value={element.value}
          onChange={(e) => {
            updateElement({
              ...element,
              value: e.currentTarget.value,
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
            updateElement({
              ...element,
              fontSize,
            });
          }}
        />
      </div>

      <div className="p-2">
        <p className="mb-2 text-xs text-muted-foreground">Text Color</p>
        <Input
          value={element.color ?? ""}
          onChange={(e) => {
            updateElement({
              ...element,
              color: e.currentTarget.value,
            });
          }}
        />
      </div>
      <div className="p-2">
        <p className="mb-2 text-xs text-muted-foreground">Background Color</p>
        <Input
          value={element.backgroundColor ?? ""}
          onChange={(e) => {
            updateElement({
              ...element,
              backgroundColor: e.currentTarget.value,
            });
          }}
        />
      </div>
      <div className="p-2">
        <p className="mb-2 text-xs text-muted-foreground">Font Weight</p>
        <Input
          value={element.fontWeight ?? ""}
          onChange={(e) => {
            updateElement({
              ...element,
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
            updateElement({
              ...element,
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
            updateElement({
              ...element,
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
            updateElement({
              ...element,
              lineHeight,
            });
          }}
        />
      </div>
    </>
  );
}

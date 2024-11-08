import { Button } from "@/components/ui/button";
import {
  AlignHorizontalJustifyCenterIcon,
  AlignHorizontalJustifyEndIcon,
  AlignHorizontalJustifyStartIcon,
  AlignVerticalJustifyCenterIcon,
  AlignVerticalJustifyEndIcon,
  AlignVerticalJustifyStartIcon,
  CopyIcon,
  Link2Icon,
  RotateCcwIcon,
  TrashIcon,
  Unlink2Icon,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useEditorStore } from "./store";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { InspectorNumberInput } from "@/components/inspector-number-input";

export default function InspectionPanel() {
  const selectedElementId = useEditorStore((state) => state.selectedElementId);

  if (selectedElementId) {
    return <ElementInspector elementId={selectedElementId} />;
  }

  return <CanvasInspector />;
}

function CanvasInspector() {
  return (
    <div className="pointer-events-auto flex w-72 flex-col overflow-y-auto rounded-lg border bg-background shadow-sm">
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
    <div className="grid grid-cols-[1fr,24px,1fr,24px] items-center gap-x-1 gap-y-2 p-2">
      <InspectorNumberInput
        value={canvasWidth}
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
      <Tooltip>
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
      </Tooltip>
      <InspectorNumberInput
        value={canvasHeight}
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
  );
}

function ElementInspector({ elementId }: { elementId: string }) {
  return (
    <div className="pointer-events-auto flex w-72 flex-col overflow-y-auto rounded-lg border bg-background shadow-sm">
      <ElementAlignment elementId={elementId} />
      <Separator />
      <ElementTransform elementId={elementId} />
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

function ElementTransform({ elementId }: { elementId: string }) {
  const transform = useEditorStore(
    (state) =>
      state.canvas.elements.find((el) => el.id === elementId)?.transform,
  );
  const updateElement = useEditorStore((state) => state.updateElement);

  if (!transform) {
    return null;
  }

  return (
    <div className="p-2">
      <p className="mb-2 text-xs text-muted-foreground">Transform</p>
      <div className="grid grid-cols-[1fr,24px,1fr,24px] items-center gap-x-1 gap-y-2">
        <InspectorNumberInput
          value={transform.position.x}
          icon={<span>X</span>}
          onValueChange={(value) => {
            updateElement(elementId, {
              transform: {
                ...transform,
                position: { ...transform.position, x: value },
              },
            });
          }}
        />
        <div></div>
        <InspectorNumberInput
          value={transform.position.y}
          icon={<span>Y</span>}
          onValueChange={(value) => {
            updateElement(elementId, {
              transform: {
                ...transform,
                position: { ...transform.position, y: value },
              },
            });
          }}
        />
        <div></div>
        <InspectorNumberInput
          value={transform.width}
          icon={<span>W</span>}
          onValueChange={(value) => {
            const width = value;
            let height = transform.height;
            if (transform.widthHeightLinked) {
              height = (transform.height * width) / transform.width;
            }
            updateElement(elementId, {
              transform: {
                ...transform,
                width,
                height,
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
              onClick={() =>
                updateElement(elementId, {
                  transform: {
                    ...transform,
                    widthHeightLinked: !transform.widthHeightLinked,
                  },
                })
              }
            >
              {transform.widthHeightLinked ? <Link2Icon /> : <Unlink2Icon />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>Maintain aspect ratio</TooltipContent>
        </Tooltip>
        <InspectorNumberInput
          value={transform.height}
          icon={<span>H</span>}
          onValueChange={(value) => {
            const height = value;
            let width = transform.width;
            if (transform.widthHeightLinked) {
              width = (transform.width * height) / transform.height;
            }
            updateElement(elementId, {
              transform: {
                ...transform,
                height,
                width,
              },
            });
          }}
        />
        <div></div>
        <InspectorNumberInput
          value={transform.rotation}
          icon={<span>R</span>}
          onValueChange={(value) => {
            updateElement(elementId, {
              transform: {
                ...transform,
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
                updateElement(elementId, {
                  transform: { ...transform, rotation: 0 },
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
          icon={<span>S</span>}
          onValueChange={(value) => {
            updateElement(elementId, {
              transform: {
                ...transform,
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
                updateElement(elementId, {
                  transform: { ...transform, scale: 1 },
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

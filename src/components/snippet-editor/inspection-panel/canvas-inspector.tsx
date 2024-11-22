import { memo } from "react";
import { useStore } from "zustand";

import BackgroundPicker from "@/components/background-picker";
import { InspectorNumberInput } from "@/components/inspector-number-input";
import { Separator } from "@/components/ui/separator";
import { useEditor } from "../editor";

export function CanvasInspector() {
  return (
    <div className="pointer-events-auto flex h-fit max-h-full w-72 flex-col overflow-y-auto rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="p-2">
        <p className="text-sm font-medium text-muted-foreground">Canvas</p>
      </div>
      <Separator />
      <CanvasTransform />
      <Separator />
      <CanvasBackground />
    </div>
  );
}

export const CanvasInspectorMemo = memo(CanvasInspector);

export function CanvasTransform() {
  const { store } = useEditor();
  const canvasWidth = useStore(store, (state) => state.transform.width);
  const canvasHeight = useStore(store, (state) => state.transform.height);
  const canvasWidthHeightLinked = useStore(
    store,
    (state) => state.transform.widthHeightLinked,
  );
  const setCanvasTransform = useStore(
    store,
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

function CanvasBackground() {
  const { store } = useEditor();
  const background = useStore(store, (state) => state.background);
  const updateSnippet = useStore(store, (state) => state.updateSnippet);

  return (
    <div className="p-2">
      <p className="mb-2 text-xs text-muted-foreground">Background</p>
      <div>
        <BackgroundPicker
          color={background.color}
          onColorChange={(color) =>
            updateSnippet({ background: { ...background, color } })
          }
        />
      </div>
    </div>
  );
}

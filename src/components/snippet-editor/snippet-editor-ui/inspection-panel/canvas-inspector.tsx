import { memo } from "react";
import { useStore } from "zustand";

import BackgroundPicker from "@/components/background-picker";
import { InspectorNumberInput } from "@/components/inspector-number-input";
import { Separator } from "@/components/ui/separator";
import { useSnippetEditor } from "../../snippet-editor";

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
  const { snippetStore } = useSnippetEditor();
  const canvasWidth = useStore(snippetStore, (state) => state.width);
  const canvasHeight = useStore(snippetStore, (state) => state.height);
  const canvasWidthHeightLinked = useStore(
    snippetStore,
    (state) => state.widthHeightLinked,
  );
  const updateSnippet = useStore(snippetStore, (state) => state.updateSnippet);

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
            updateSnippet({
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
            updateSnippet({
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
  const { snippetStore } = useSnippetEditor();
  const background = useStore(snippetStore, (state) => state.background);
  const updateSnippet = useStore(snippetStore, (state) => state.updateSnippet);

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

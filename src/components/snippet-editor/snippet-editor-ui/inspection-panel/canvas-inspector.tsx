import { memo } from "react";
import { TrashIcon } from "lucide-react";
import { useStore } from "zustand";

import BackgroundPicker from "@/components/background-picker";
import ImagePicker from "@/components/image-picker";
import { InspectorNumberInput } from "@/components/inspector-number-input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { iBackground } from "@/lib/validator/color";
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
      <p className="mb-2">Fill</p>
      <div className="space-y-2">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Background Color</p>
          <div className="flex gap-2">
            <BackgroundPicker
              color={background.color}
              onColorChange={(color) =>
                updateSnippet({ background: { ...background, color } })
              }
              className="flex-1"
            />
            <Button
              onClick={() =>
                updateSnippet({ background: { ...background, color: null } })
              }
              variant="outline"
              size="icon"
            >
              <TrashIcon />
            </Button>
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Background Image</p>

          <div className="flex gap-2">
            <ImagePicker
              image={background.image}
              onImagePick={(image) =>
                updateSnippet({ background: { ...background, image } })
              }
              category="wallpaper"
              className="flex-1"
            />
            <Button
              onClick={() =>
                updateSnippet({ background: { ...background, image: null } })
              }
              variant="outline"
              size="icon"
            >
              <TrashIcon />
            </Button>
          </div>
        </div>
        {background.image && (
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Image Fill Mode</p>
            <div className="flex h-10 w-fit gap-0.5 rounded-lg border p-0.5">
              {[
                { label: "Cover", value: "cover" },
                { label: "Contain", value: "contain" },
                { label: "Fill", value: "fill" },
              ].map((option) => (
                <Button
                  variant="ghost"
                  key={option.value}
                  className={cn("h-full rounded-sm px-3", {
                    "bg-accent text-accent-foreground":
                      option.value === (background.imageFill ?? "cover"),
                  })}
                  onClick={() =>
                    updateSnippet({
                      background: {
                        ...background,
                        imageFill: option.value as iBackground["imageFill"],
                      },
                    })
                  }
                  title={option.label}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

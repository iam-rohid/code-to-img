import {
  AppWindowMacIcon,
  ImageIcon,
  InfoIcon,
  MenuIcon,
  MinusIcon,
  PlusIcon,
  RedoIcon,
  Share,
  SquareIcon,
  TypeIcon,
  UndoIcon,
} from "lucide-react";
import InspectionPanel from "./inspection-panel";
import { Button } from "@/components/ui/button";
import UserButton from "@/components/user-button";
import { useEditorStore } from "./store";
import { getCodeEditorElement } from "./utils";

export default function UI() {
  const addElement = useEditorStore((state) => state.addElement);
  const canvasWidth = useEditorStore((state) => state.canvas.width);
  const canvasHeight = useEditorStore((state) => state.canvas.height);

  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex flex-col gap-4 p-4">
      <div className="flex items-center gap-2">
        <div className="flex-1 justify-start">
          <div className="pointer-events-auto flex w-fit items-center gap-2 rounded-lg border bg-background p-1 shadow-sm">
            <Button size="icon" variant="ghost">
              <MenuIcon />
            </Button>
          </div>
        </div>

        <div className="pointer-events-auto flex items-center gap-2 rounded-lg border bg-background p-1 shadow-sm">
          <div>
            <Button
              size="icon"
              variant="ghost"
              onClick={() =>
                addElement(getCodeEditorElement(canvasWidth, canvasHeight))
              }
            >
              <AppWindowMacIcon />
            </Button>
            <Button size="icon" variant="ghost">
              <TypeIcon />
            </Button>
            <Button size="icon" variant="ghost">
              <ImageIcon />
            </Button>
            <Button size="icon" variant="ghost">
              <SquareIcon />
            </Button>
          </div>
        </div>

        <div className="flex flex-1 justify-end">
          <div className="pointer-events-auto flex w-fit items-center justify-end gap-2 rounded-lg border bg-background p-1 shadow-sm">
            <Button>
              <Share />
              Share
            </Button>
            <UserButton />
          </div>
        </div>
      </div>

      <div className="flex-1">
        <InspectionPanel />
      </div>

      <div className="flex items-center gap-2">
        <div className="pointer-events-auto flex items-center gap-2 rounded-lg border bg-background p-1 shadow-sm">
          <Button size="icon" variant="ghost">
            <MinusIcon />
          </Button>
          <p className="text-sm text-muted-foreground">100%</p>
          <Button size="icon" variant="ghost">
            <PlusIcon />
          </Button>
        </div>
        <div className="pointer-events-auto flex items-center gap-2 rounded-lg border bg-background p-1 shadow-sm">
          <Button size="icon" variant="ghost">
            <UndoIcon />
          </Button>
          <Button size="icon" variant="ghost">
            <RedoIcon />
          </Button>
        </div>

        <div className="flex-1"></div>

        <div className="pointer-events-auto flex items-center gap-2 rounded-lg border bg-background p-1 shadow-sm">
          <Button size="icon" variant="ghost">
            <InfoIcon />
          </Button>
        </div>
      </div>
    </div>
  );
}

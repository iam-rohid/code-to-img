import { Button } from "../ui/button";
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
import UserButton from "../user-button";
import { iElement, useEditorStore } from "@/store/editor-store";
import { nanoid } from "nanoid";
import InspectionPanel from "./inspection-panel";

const CodeEditorElement: Omit<iElement, "id"> = {
  type: "code-editor",
  height: 200,
  width: 300,
  minHeight: 100,
  minWidth: 100,
  widthHeightLinked: false,
  name: "Code Editor",
  position: { x: 0, y: 0 },
  positionConstraints: { x: "center", y: "center" },
  rotation: 0,
  scale: 1,
};

export default function UI() {
  const addElement = useEditorStore((state) => state.addElement);

  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex flex-col gap-4 p-4">
      <div className="flex items-center gap-2">
        <div className="flex-1 justify-start">
          <div className="pointer-events-auto flex w-fit items-center gap-2 rounded-lg bg-background p-1">
            <Button size="icon" variant="ghost">
              <MenuIcon />
            </Button>
          </div>
        </div>

        <div className="pointer-events-auto flex items-center gap-2 rounded-lg bg-background p-1">
          <div>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => addElement({ id: nanoid(), ...CodeEditorElement })}
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
          <div className="pointer-events-auto flex w-fit items-center justify-end gap-4 rounded-lg bg-background p-1">
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
        <div className="pointer-events-auto flex items-center gap-2 rounded-lg bg-background p-1">
          <Button size="icon" variant="ghost">
            <MinusIcon />
          </Button>
          <p className="text-sm text-muted-foreground">100%</p>
          <Button size="icon" variant="ghost">
            <PlusIcon />
          </Button>
        </div>
        <div className="pointer-events-auto flex items-center gap-2 rounded-lg bg-background p-1">
          <Button size="icon" variant="ghost">
            <UndoIcon />
          </Button>
          <Button size="icon" variant="ghost">
            <RedoIcon />
          </Button>
        </div>

        <div className="flex-1"></div>

        <div className="pointer-events-auto flex items-center gap-2 rounded-lg bg-background p-1">
          <Button size="icon" variant="ghost">
            <InfoIcon />
          </Button>
        </div>
      </div>
    </div>
  );
}

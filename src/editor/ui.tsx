import {
  AppWindowMacIcon,
  ArrowRightIcon,
  CircleIcon,
  CopyIcon,
  EyeClosedIcon,
  EyeIcon,
  HexagonIcon,
  ImageIcon,
  InfoIcon,
  LayersIcon,
  LockIcon,
  MenuIcon,
  MinusIcon,
  PlusIcon,
  RedoIcon,
  ShapesIcon,
  Share,
  SquareIcon,
  TrashIcon,
  TypeIcon,
  UndoIcon,
  UnlockIcon,
} from "lucide-react";
import InspectionPanel from "./inspection-panel";
import { Button } from "@/components/ui/button";
import UserButton from "@/components/user-button";
import { useEditorStore } from "./store";
import { getCodeEditorElement, getTextElement } from "./utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

export default function UI() {
  const layersOpen = useEditorStore((state) => state.layersOpen);
  const setLayersOpen = useEditorStore((state) => state.setLayersOpen);

  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex flex-col gap-4 p-4">
      <div className="flex items-center gap-2">
        <div className="flex-1 justify-start">
          <div className="pointer-events-auto flex w-fit items-center gap-2 rounded-lg border bg-background p-1 shadow-sm">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost">
                  <MenuIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="bottom" align="start">
                <DropdownMenuItem
                  onClick={() =>
                    useEditorStore.setState(useEditorStore.getInitialState())
                  }
                >
                  <TrashIcon />
                  Reset to canvas
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <Toolbar />

        <div className="flex flex-1 justify-end">
          <div className="pointer-events-auto flex w-fit items-center justify-end gap-2 rounded-lg border bg-background p-1 shadow-sm">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className={cn({
                    "bg-accent text-accent-foreground": layersOpen,
                  })}
                  onClick={() => setLayersOpen(!layersOpen)}
                >
                  <LayersIcon />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {layersOpen ? "Hide layers panel" : "Show layers panel"}
              </TooltipContent>
            </Tooltip>
            <Button>
              <Share />
              Share
            </Button>
            <UserButton />
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <InspectionPanel />
        <div className="flex-1"></div>
        {layersOpen && <LayersPanel />}
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

function Toolbar() {
  const addElement = useEditorStore((state) => state.addElement);
  const canvasWidth = useEditorStore((state) => state.canvas.width);
  const canvasHeight = useEditorStore((state) => state.canvas.height);

  return (
    <div className="pointer-events-auto flex items-center gap-2 rounded-lg border bg-background p-1 shadow-sm">
      <div>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => {
            addElement(getCodeEditorElement(canvasWidth, canvasHeight));
          }}
        >
          <AppWindowMacIcon />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => {
            addElement(getTextElement(canvasWidth, canvasHeight));
          }}
        >
          <TypeIcon />
        </Button>
        <Button size="icon" variant="ghost">
          <ImageIcon />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost">
              <ShapesIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="bottom" align="end">
            <DropdownMenuItem>
              <SquareIcon />
              Rectangle
            </DropdownMenuItem>
            <DropdownMenuItem>
              <CircleIcon />
              Ellipse
            </DropdownMenuItem>
            <DropdownMenuItem>
              <HexagonIcon />
              Polygon
            </DropdownMenuItem>
            <DropdownMenuItem>
              <ArrowRightIcon />
              Arrow
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

function LayersPanel() {
  const elements = useEditorStore((state) => state.canvas.elements);
  const selectedElementId = useEditorStore((state) => state.selectedElementId);
  const setSelectedElement = useEditorStore(
    (state) => state.setSelectedElement,
  );
  const updateElementState = useEditorStore(
    (state) => state.updateElementState,
  );
  const duplicateElement = useEditorStore((state) => state.duplicateElement);
  const removeElement = useEditorStore((state) => state.removeElement);
  const updateElement = useEditorStore((state) => state.updateElement);

  return (
    <div className="pointer-events-auto flex h-fit max-h-full w-72 flex-col overflow-y-auto rounded-lg border bg-background shadow-sm">
      <div className="p-2">
        <p className="text-sm font-medium text-muted-foreground">Layers</p>
      </div>
      <Separator />
      <div className="grid gap-2 p-2">
        <div className="grid gap-px">
          {elements.toReversed().map((element) => (
            <div key={element.id} className="group relative">
              <ContextMenu>
                <ContextMenuTrigger asChild>
                  <Button
                    onClick={() => setSelectedElement(element.id)}
                    variant="ghost"
                    className={cn(
                      "flex h-9 w-full items-center justify-start rounded-md px-2 text-left text-muted-foreground",
                      {
                        "bg-secondary text-foreground":
                          element.id === selectedElementId,
                        "text-muted-foreground/50 hover:text-muted-foreground/50":
                          element.hidden,
                      },
                    )}
                    onMouseEnter={() => {
                      if (!element.hidden && !element.locked) {
                        updateElementState(element.id, { hovering: true });
                      }
                    }}
                    onMouseLeave={() => {
                      if (!element.hidden && !element.locked) {
                        updateElementState(element.id, { hovering: false });
                      }
                    }}
                  >
                    {element.type === "code-editor" ? (
                      <AppWindowMacIcon />
                    ) : element.type === "text" ? (
                      <TypeIcon />
                    ) : null}
                    <p>{element.name}</p>
                  </Button>
                </ContextMenuTrigger>
                <ContextMenuContent>
                  <ContextMenuItem onClick={() => duplicateElement(element.id)}>
                    <CopyIcon />
                    Duplicate
                  </ContextMenuItem>
                  <ContextMenuItem
                    onClick={() =>
                      updateElement({ ...element, hidden: !element.hidden })
                    }
                  >
                    {element.hidden ? <EyeIcon /> : <EyeClosedIcon />}
                    {element.hidden ? "Show" : "Hide"}
                  </ContextMenuItem>
                  <ContextMenuItem onClick={() => removeElement(element.id)}>
                    <TrashIcon />
                    Delete
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
              <div className="pointer-events-none absolute inset-0 flex items-center justify-end gap-1 px-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "pointer-events-auto h-6 w-6 group-hover:visible",
                    {
                      invisible: !element.locked,
                    },
                  )}
                  onClick={() =>
                    updateElement({ ...element, locked: !element.locked })
                  }
                >
                  {element.locked ? <LockIcon /> : <UnlockIcon />}
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "pointer-events-auto h-6 w-6 group-hover:visible",
                    {
                      invisible: !element.hidden,
                    },
                  )}
                  onClick={() =>
                    updateElement({ ...element, hidden: !element.hidden })
                  }
                >
                  {element.hidden ? <EyeClosedIcon /> : <EyeIcon />}
                </Button>
              </div>
            </div>
          ))}
        </div>
        <Separator />
        <Button
          onClick={() => setSelectedElement("canvas")}
          variant="ghost"
          className={cn(
            "flex h-9 items-center justify-start rounded-md px-2 text-left text-muted-foreground",
            {
              "bg-secondary": selectedElementId === "canvas",
            },
          )}
        >
          <ImageIcon />
          <p>Background</p>
        </Button>
      </div>
    </div>
  );
}

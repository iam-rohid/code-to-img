import { memo, useCallback, useContext, useMemo } from "react";
import { Reorder } from "framer-motion";
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
  LayoutGridIcon,
  LockIcon,
  LogInIcon,
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
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import UserButton from "@/components/user-button";
import { cn } from "@/lib/utils";
import {
  getCodeEditorElement,
  getDefaultSnippetData,
  getTextElement,
} from "@/lib/utils/editor";
import { useAuth } from "@/providers/auth-provider";
import { useEditor } from "@/providers/editor-provider";
import {
  SnippetStoreContext,
  useSnippetStore,
} from "@/providers/snippet-store-provider";
import { useEditorStore } from "@/store/editor-store";
import { ThemeSwitcher } from "../theme-toggle";
import { Skeleton } from "../ui/skeleton";

import { InspectionPanelMemo } from "./inspection-panel";

export default function EditorUI() {
  const { status } = useAuth();
  const layersOpen = useEditorStore((state) => state.layersOpen);
  const setLayersOpen = useEditorStore((state) => state.setLayersOpen);
  const zoom = useEditorStore((state) => state.zoom);
  const setZoom = useEditorStore((state) => state.setZoom);
  const viewPortOffset = useEditorStore((state) => state.viewPortOffset);
  const setViewPortOffset = useEditorStore((state) => state.setViewPortOffset);
  const snippetStore = useContext(SnippetStoreContext);
  const { isDurty, isSaving } = useEditor();

  const zoomPercentage = useMemo(() => Math.round(zoom * 100), [zoom]);

  const handleZoomIn = useCallback(() => {
    const newValue = Math.min(zoomPercentage + 10, 3000);
    setZoom(newValue / 100);
  }, [setZoom, zoomPercentage]);

  const handleZoomOut = useCallback(() => {
    const newValue = Math.max(zoomPercentage - 10, 10);
    setZoom(newValue / 100);
  }, [setZoom, zoomPercentage]);

  const handleResetZoom = useCallback(() => {
    setZoom(1);
  }, [setZoom]);

  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex flex-col gap-4 p-4">
      <div className="flex items-center gap-2">
        <div className="flex-1 justify-start">
          <div className="pointer-events-auto flex w-fit items-center gap-2 rounded-lg border bg-editor-card p-1 text-editor-card-foreground shadow-sm">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost">
                  <MenuIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="bottom"
                align="start"
                className="bg-editor-card text-editor-card-foreground"
              >
                {status === "loading" ? (
                  <Skeleton className="h-10 w-20" />
                ) : status === "unauthorized" ? (
                  <DropdownMenuItem asChild>
                    <Link href="/login">
                      <LogInIcon />
                      Log In
                    </Link>
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem asChild>
                    <Link href="/">
                      <LayoutGridIcon />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    snippetStore?.setState(getDefaultSnippetData());
                  }}
                >
                  <TrashIcon />
                  Reset the canvas
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <div className="flex items-center justify-between gap-2 px-2">
                  <p className="text-sm font-medium">Theme</p>
                  <ThemeSwitcher />
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <Toolbar />

        <div className="flex flex-1 justify-end">
          <div className="pointer-events-auto flex w-fit items-center justify-end gap-2 rounded-lg border bg-editor-card p-1 text-editor-card-foreground shadow-sm">
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
        <InspectionPanelMemo />
        <div className="flex-1"></div>
        {layersOpen && <LayersPanelMemo />}
      </div>

      <div className="flex items-center gap-2">
        <div className="flex flex-1 items-center gap-2">
          <div className="pointer-events-auto flex items-center gap-2 rounded-lg border bg-editor-card p-1 text-editor-card-foreground shadow-sm">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="ghost" onClick={handleZoomOut}>
                  <MinusIcon />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Zoom Out</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handleResetZoom}
                  className="flex h-10 items-center justify-center text-center text-sm text-muted-foreground"
                >
                  {zoomPercentage}%
                </button>
              </TooltipTrigger>
              <TooltipContent>Reset Zoom</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="ghost" onClick={handleZoomIn}>
                  <PlusIcon />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Zoom In</TooltipContent>
            </Tooltip>
          </div>

          <div className="pointer-events-auto flex items-center gap-2 rounded-lg border bg-editor-card p-1 text-editor-card-foreground shadow-sm">
            <Button size="icon" variant="ghost">
              <UndoIcon />
            </Button>
            <Button size="icon" variant="ghost">
              <RedoIcon />
            </Button>
          </div>
        </div>
        {(viewPortOffset.x !== 0 || viewPortOffset.y !== 0) && (
          <div className="pointer-events-auto flex items-center gap-2 rounded-lg border bg-editor-card p-1 text-editor-card-foreground shadow-sm">
            <Button
              onClick={() => setViewPortOffset({ x: 0, y: 0 })}
              variant="ghost"
            >
              Reset Viewport
            </Button>
          </div>
        )}
        <div className="flex flex-1 items-center justify-end gap-2">
          {isSaving ? (
            <p className="text-sm text-muted-foreground">Saving...</p>
          ) : isDurty ? (
            <p className="text-sm text-muted-foreground">Unsaved changes</p>
          ) : null}
          <div className="pointer-events-auto flex items-center gap-2 rounded-lg border bg-editor-card p-1 text-editor-card-foreground shadow-sm">
            <Button size="icon" variant="ghost">
              <InfoIcon />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Toolbar() {
  const addElement = useSnippetStore((state) => state.addElement);
  const canvasWidth = useSnippetStore((state) => state.transform.width);
  const canvasHeight = useSnippetStore((state) => state.transform.height);

  return (
    <div className="pointer-events-auto flex items-center gap-2 rounded-lg border bg-editor-card p-1 text-editor-card-foreground shadow-sm">
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
  const updateSnippet = useSnippetStore((state) => state.updateSnippet);
  const elements = useSnippetStore((state) => state.elements);
  const selectedElementId = useEditorStore((state) => state.selectedElementId);
  const setSelectedElement = useEditorStore(
    (state) => state.setSelectedElement,
  );
  const updateElementState = useEditorStore(
    (state) => state.updateElementState,
  );
  const duplicateElement = useSnippetStore((state) => state.duplicateElement);
  const removeElement = useSnippetStore((state) => state.removeElement);
  const updateElement = useSnippetStore((state) => state.updateElement);

  return (
    <div className="pointer-events-auto flex h-fit max-h-full w-72 flex-col overflow-y-auto rounded-lg border bg-editor-card text-editor-card-foreground shadow-sm">
      <div className="p-2">
        <p className="text-sm font-medium text-muted-foreground">Layers</p>
      </div>
      <Separator />
      <div className="grid gap-2 p-2">
        <Reorder.Group
          axis="y"
          values={elements}
          onReorder={(elements) => {
            updateSnippet({ elements: elements });
          }}
        >
          <div className="grid gap-px">
            {elements.map((element) => (
              <Reorder.Item key={element.id} value={element}>
                <div className="group relative">
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
                      <ContextMenuItem
                        onClick={() => duplicateElement(element.id)}
                      >
                        <CopyIcon />
                        Duplicate
                      </ContextMenuItem>
                      <ContextMenuItem
                        onClick={() =>
                          updateElement(element.id, { hidden: !element.hidden })
                        }
                      >
                        {element.hidden ? <EyeIcon /> : <EyeClosedIcon />}
                        {element.hidden ? "Show" : "Hide"}
                      </ContextMenuItem>
                      <ContextMenuItem
                        onClick={() => removeElement(element.id)}
                      >
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
                        updateElement(element.id, { locked: !element.locked })
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
                        updateElement(element.id, { hidden: !element.hidden })
                      }
                    >
                      {element.hidden ? <EyeClosedIcon /> : <EyeIcon />}
                    </Button>
                  </div>
                </div>
              </Reorder.Item>
            ))}
          </div>
        </Reorder.Group>

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

const LayersPanelMemo = memo(LayersPanel);

import { memo, useCallback, useContext, useMemo } from "react";
import { Reorder } from "framer-motion";
import {
  AppWindowMacIcon,
  ArrowRightIcon,
  CircleAlertIcon,
  CircleCheckBigIcon,
  CircleIcon,
  Code2Icon,
  CopyIcon,
  EditIcon,
  EyeClosedIcon,
  EyeIcon,
  HexagonIcon,
  ImageIcon,
  ImagePlusIcon,
  InfoIcon,
  LayersIcon,
  Loader2,
  LockIcon,
  LogInIcon,
  MenuIcon,
  MinusIcon,
  PlusIcon,
  RedoIcon,
  ShapesIcon,
  Share,
  Share2Icon,
  SidebarCloseIcon,
  SidebarOpenIcon,
  SquareIcon,
  TrashIcon,
  TypeIcon,
  UndoIcon,
  UnlockIcon,
} from "lucide-react";
import { nanoid } from "nanoid";
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
import { getCodeEditorElement, getTextElement } from "@/lib/constants/elements";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";
import { useSnippetData } from "@/providers/snippet-data-provider";
import { useSnippet } from "@/providers/snippet-provider";
import { useSnippetStore } from "@/providers/snippet-store-provider";
import { useEditorStore } from "@/store/editor-store";
import { useRenameSnippetModal } from "../modals/rename-snippet-modal";
import { ThemeSwitcher } from "../theme-toggle";
import { SidebarContext } from "../ui/sidebar";

import { InspectionPanelMemo } from "./inspection-panel";

export default function EditorUI() {
  const { status } = useAuth();
  const layersOpen = useEditorStore((state) => state.layersOpen);
  const setLayersOpen = useEditorStore((state) => state.setLayersOpen);
  const zoom = useEditorStore((state) => state.zoom);
  const setZoom = useEditorStore((state) => state.setZoom);
  const viewPortOffset = useEditorStore((state) => state.viewPortOffset);
  const setViewPortOffset = useEditorStore((state) => state.setViewPortOffset);
  const { isDurty, isSaving } = useSnippetData();
  const sidebarContext = useContext(SidebarContext);
  const snippet = useSnippet();
  const [RenameModal, , setShowRenameModal] = useRenameSnippetModal();

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
        <div className="flex flex-1 items-center justify-start gap-2 overflow-hidden">
          <div className="pointer-events-auto flex items-center gap-2">
            {sidebarContext && (
              <Button
                onClick={() => sidebarContext.toggleSidebar()}
                variant="secondary"
                size="icon"
                className="flex-shrink-0"
              >
                {sidebarContext.open ? (
                  <SidebarCloseIcon />
                ) : (
                  <SidebarOpenIcon />
                )}
              </Button>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  className="flex-shrink-0"
                >
                  <MenuIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="bottom"
                align="start"
                className="bg-card text-card-foreground"
              >
                {snippet && (
                  <DropdownMenuItem onClick={() => setShowRenameModal(true)}>
                    <EditIcon />
                    Rename Snippet
                  </DropdownMenuItem>
                )}

                <DropdownMenuItem>
                  <ImagePlusIcon />
                  Export as Image
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Share2Icon />
                  Share
                </DropdownMenuItem>

                {status === "authorized" && snippet && (
                  <DropdownMenuItem>
                    <Code2Icon />
                    Embeddable Link
                  </DropdownMenuItem>
                )}

                {status === "unauthorized" && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/login">
                        <LogInIcon />
                        Log In
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}

                <DropdownMenuSeparator />

                <div className="flex items-center justify-between gap-2 px-2">
                  <p className="text-sm font-medium">Theme</p>
                  <ThemeSwitcher />
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {snippet && <RenameModal snippet={snippet} />}
            {snippet && <p className="truncate">{snippet.title}</p>}
          </div>
        </div>

        <Toolbar />

        <div className="flex flex-1 items-center justify-end gap-2 overflow-hidden">
          <div className="pointer-events-auto flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="secondary"
                  className={cn("flex-shrink-0", {
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

            <Button className="flex-shrink-0">
              <Share />
              Share
            </Button>
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
          <div className="pointer-events-auto flex items-center gap-2">
            <div className="flex items-center">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="rounded-r-none"
                    onClick={handleZoomOut}
                  >
                    <MinusIcon />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Zoom Out</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={handleResetZoom}
                    className="flex h-10 items-center justify-center bg-secondary px-2 text-center text-sm text-accent-foreground"
                  >
                    {zoomPercentage}%
                  </button>
                </TooltipTrigger>
                <TooltipContent>Reset Zoom</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="rounded-l-none"
                    onClick={handleZoomIn}
                  >
                    <PlusIcon />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Zoom In</TooltipContent>
              </Tooltip>
            </div>

            <div className="flex items-center">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="rounded-r-none"
                  >
                    <UndoIcon />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Undo</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="rounded-l-none"
                  >
                    <RedoIcon />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Redo</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>

        {(viewPortOffset.x !== 0 || viewPortOffset.y !== 0) && (
          <Button
            onClick={() => setViewPortOffset({ x: 0, y: 0 })}
            variant="secondary"
            className="pointer-events-auto"
          >
            Reset Viewport
          </Button>
        )}

        <div className="flex flex-1 items-center justify-end gap-2">
          <div className="pointer-events-auto flex items-center gap-2">
            {isSaving ? (
              <div className="flex items-center rounded-full border px-3 py-1">
                <Loader2 className="-ml-1 mr-1 h-3 w-3 animate-spin" />
                <p className="text-xs font-medium text-muted-foreground">
                  Saving...
                </p>
              </div>
            ) : isDurty ? (
              <div className="flex items-center rounded-full border px-3 py-1">
                <CircleAlertIcon className="-ml-1 mr-1 h-3 w-3" />
                <p className="text-xs font-medium text-muted-foreground">
                  Unsaved changes
                </p>
              </div>
            ) : (
              <div className="flex items-center rounded-full border px-3 py-1 opacity-0 transition-opacity delay-1000 duration-200">
                <CircleCheckBigIcon className="-ml-1 mr-1 h-3 w-3" />
                <p className="text-xs font-medium text-muted-foreground">
                  Saved
                </p>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Button size="icon" variant="secondary" className="flex-shrink-0">
                <InfoIcon />
              </Button>
            </div>
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
    <div className="pointer-events-auto flex items-center gap-1 rounded-lg border bg-card p-0.5 text-card-foreground shadow-md">
      <Button
        size="icon"
        variant="ghost"
        onClick={() => {
          addElement(
            getCodeEditorElement({
              id: nanoid(),
              canvasWidth,
              canvasHeight,
            }),
          );
        }}
      >
        <AppWindowMacIcon />
      </Button>
      <Button
        size="icon"
        variant="ghost"
        onClick={() => {
          addElement(
            getTextElement({
              id: nanoid(),
              canvasWidth,
              canvasHeight,
            }),
          );
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
    <div className="pointer-events-auto flex h-fit max-h-full w-72 flex-col overflow-y-auto rounded-lg border bg-card text-card-foreground shadow-sm">
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

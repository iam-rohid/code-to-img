import { memo, useCallback, useContext, useMemo, useState } from "react";
import { Reorder } from "framer-motion";
import {
  AppWindowMacIcon,
  Code2Icon,
  CopyIcon,
  EditIcon,
  EyeClosedIcon,
  EyeIcon,
  ImageIcon,
  ImagePlusIcon,
  InfoIcon,
  LayersIcon,
  LockIcon,
  LogInIcon,
  MenuIcon,
  MinusIcon,
  PlusIcon,
  RedoIcon,
  RefreshCcw,
  Share,
  Share2Icon,
  SidebarCloseIcon,
  SidebarOpenIcon,
  TrashIcon,
  TypeIcon,
  UndoIcon,
  UnlockIcon,
} from "lucide-react";
import Link from "next/link";
import { useStore } from "zustand";

import { useExportImageModal } from "@/components/modals/export-image-modal";
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
import { DEFAULT_SNIPPET_TEMPLATE } from "@/lib/constants/templates";
import { getEditor } from "@/lib/tiptap";
import { cn } from "@/lib/utils";
import { iSnippetData } from "@/lib/validator/snippet";
import { useAuth } from "@/providers/auth-provider";
import { useSnippet } from "@/providers/snippet-provider";
import { useRenameSnippetModal } from "../../modals/rename-snippet-modal";
import { ThemeSwitcher } from "../../theme-toggle";
import { SidebarContext } from "../../ui/sidebar";
import { useSnippetEditor } from "../snippet-editor";

import { InspectionPanelMemo } from "./inspection-panel";
import Toolbar from "./toolbar";

export default function SnippetEditorUI() {
  const { readOnly, editorStore, snippetStore } = useSnippetEditor();
  const { status } = useAuth();
  const layersOpen = useStore(editorStore, (state) => state.layersOpen);
  const setLayersOpen = useStore(editorStore, (state) => state.setLayersOpen);
  const zoom = useStore(editorStore, (state) => state.zoom);
  const setZoom = useStore(editorStore, (state) => state.setZoom);
  const scrollX = useStore(editorStore, (state) => state.scrollX);
  const scrollY = useStore(editorStore, (state) => state.scrollY);
  const setScroll = useStore(editorStore, (state) => state.setScroll);
  const sidebarContext = useContext(SidebarContext);
  const snippet = useSnippet();
  const [RenameModal, , setShowRenameModal] = useRenameSnippetModal();
  const [ExportImageModal, , setExportImageModalOpen] = useExportImageModal();

  const [snippetDataForExportImage, setSnippetDataForExportImage] =
    useState<iSnippetData | null>(null);

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

  const handleExportImage = useCallback(() => {
    setSnippetDataForExportImage(snippetStore.getState());
    setExportImageModalOpen(true);
  }, [setExportImageModalOpen, snippetStore]);

  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex flex-col gap-4 p-4">
      <div className="flex items-center gap-2">
        <div className="flex flex-1 items-center justify-start gap-2">
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
                {snippet ? (
                  <DropdownMenuItem onClick={() => setShowRenameModal(true)}>
                    <EditIcon />
                    Rename Snippet
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem
                    onClick={() =>
                      snippetStore.setState(DEFAULT_SNIPPET_TEMPLATE.data)
                    }
                  >
                    <RefreshCcw />
                    Reset Canvas
                  </DropdownMenuItem>
                )}

                <DropdownMenuItem onClick={handleExportImage}>
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

        {readOnly ? null : <Toolbar />}

        <div className="flex flex-1 items-center justify-end gap-2">
          {readOnly ? null : (
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

              <Button className="flex-shrink-0" onClick={handleExportImage}>
                <Share />
                Export
              </Button>
            </div>
          )}
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

            {!readOnly && (
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
            )}
          </div>
        </div>

        {(scrollX !== 0 || scrollY !== 0) && (
          <Button
            onClick={() => setScroll(0, 0)}
            variant="secondary"
            className="pointer-events-auto"
          >
            Reset Viewport
          </Button>
        )}

        <div className="flex flex-1 items-center justify-end gap-2">
          <div className="pointer-events-auto flex items-center gap-2">
            {!readOnly && (
              <div className="flex items-center gap-2">
                <Button
                  size="icon"
                  variant="secondary"
                  className="flex-shrink-0"
                >
                  <InfoIcon />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {snippetDataForExportImage && (
        <ExportImageModal
          snippetData={snippetDataForExportImage}
          name={snippet?.title}
        />
      )}
    </div>
  );
}

function LayersPanel() {
  const { snippetStore, editorStore } = useSnippetEditor();

  const updateSnippet = useStore(snippetStore, (state) => state.updateSnippet);
  const elements = useStore(snippetStore, (state) => state.elements);
  const duplicateElement = useStore(
    snippetStore,
    (state) => state.duplicateElement,
  );
  const setTipTapEditor = useStore(
    editorStore,
    (state) => state.setTipTapEditor,
  );
  const removeElement = useStore(snippetStore, (state) => state.removeElement);
  const updateElement = useStore(snippetStore, (state) => state.updateElement);

  const selectedElementId = useStore(
    editorStore,
    (state) => state.selectedElementId,
  );
  const setSelectedElement = useStore(
    editorStore,
    (state) => state.setSelectedElement,
  );
  const updateElementState = useStore(
    editorStore,
    (state) => state.updateElementState,
  );

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
                        onClick={() => {
                          const duplicatedElement = duplicateElement(
                            element.id,
                          );
                          if (duplicatedElement) {
                            if (duplicatedElement.type === "text") {
                              setTipTapEditor(
                                duplicatedElement.id,
                                getEditor(duplicatedElement),
                              );
                            }
                            setSelectedElement(duplicatedElement.id);
                          }
                        }}
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

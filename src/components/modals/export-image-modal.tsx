"use client";

import {
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useState,
} from "react";
import { DialogProps } from "@radix-ui/react-dialog";
import { toBlob, toPng } from "html-to-image";
import { ClipboardIcon, DownloadIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { iSnippetData } from "@/lib/validator/snippet";
import SnippetViewer from "../snippet-editor/snippet-viewer";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Label } from "../ui/label";

export type ExportImageModalProps = Omit<DialogProps, "children"> & {
  snippetData: iSnippetData;
  name?: string;
};

export default function ExportImageModal({
  snippetData,
  name,
  ...props
}: ExportImageModalProps) {
  const [scale, setScale] = useState<number>(2);
  const [exporting, setExporting] = useState(false);

  const getName = useCallback(() => {
    return name ?? `Untitled`;
  }, [name]);

  const handleExportAsPNG = useCallback(async () => {
    const node = document.getElementById("snippet-canvas");
    if (!node) {
      toast.error("Node not found!");
      return;
    }
    setExporting(true);
    try {
      const dataUrl = await toPng(node, {
        width: snippetData.width,
        height: snippetData.height,
        pixelRatio: scale,
      });
      const link = document.createElement("a");
      link.download = `${getName()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      toast.error("Failed to export as png", {
        description:
          (error as { message?: string }).message ?? "Something went wrong!",
      });
    } finally {
      setExporting(false);
    }
  }, [getName, scale, snippetData.height, snippetData.width]);

  const handleCopyToClipboard = useCallback(async () => {
    const node = document.getElementById("snippet-canvas");
    if (!node) {
      toast.error("Node not found!");
      return;
    }
    setExporting(true);
    try {
      const blob = await toBlob(node, {
        width: snippetData.width,
        height: snippetData.height,
        pixelRatio: scale,
      });
      if (!blob) {
        throw new Error("Something went wrong!");
      }
      window.navigator.clipboard.write([
        new ClipboardItem({
          "image/png": blob,
        }),
      ]);
      toast.success("Copied to clipboard");
    } catch (error) {
      toast.error("Failed to copy to clipboard", {
        description:
          (error as { message?: string }).message ?? "Something went wrong!",
      });
    } finally {
      setExporting(false);
    }
  }, [scale, snippetData.height, snippetData.width]);

  return (
    <Dialog {...props}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export Image</DialogTitle>
        </DialogHeader>
        <div
          className="aspect-[3/2] w-full overflow-hidden rounded-lg border"
          style={{
            background: `repeating-conic-gradient(hsl(var(--border)) 0% 25%, hsl(var(--background)) 0% 50%) 50% / 16px 16px`,
          }}
        >
          <SnippetViewer
            data={snippetData}
            className="h-full w-full"
            snippetElementId="snippet-canvas"
          />
        </div>

        <div className="flex items-center justify-between">
          <Label>Scale</Label>
          <div className="flex w-fit gap-1 rounded-lg border p-1">
            {[1, 2, 3, 4].map((s) => (
              <Button
                key={s}
                onClick={() => setScale(s)}
                className={cn("h-8", {
                  "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground":
                    s == scale,
                })}
                variant="ghost"
                size="sm"
              >
                {s}x
              </Button>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleExportAsPNG} disabled={exporting}>
            {exporting ? (
              <Loader2 className="animate-spin" />
            ) : (
              <DownloadIcon />
            )}
            PNG
          </Button>
          <Button disabled={exporting} onClick={handleCopyToClipboard}>
            {exporting ? (
              <Loader2 className="animate-spin" />
            ) : (
              <ClipboardIcon />
            )}
            Copy to Clipboard
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export const useExportImageModal = (): [
  (props: ExportImageModalProps) => ReactNode,
  boolean,
  Dispatch<SetStateAction<boolean>>,
] => {
  const [open, setOpen] = useState(false);
  const Modal = useCallback(
    (props: ExportImageModalProps) => (
      <ExportImageModal open={open} onOpenChange={setOpen} {...props} />
    ),
    [open],
  );

  return [Modal, open, setOpen];
};

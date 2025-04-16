"use client";

import {
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from "react";
import { DialogProps } from "@radix-ui/react-dialog";
import Image from "next/image";

import { allImages, iImage } from "@/data/images";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

const categoryMapName = (category: string) => {
  const rec: Record<string, string> = {
    social_media: "Social Media",
    wallpaper: "Wallpaper",
    element: "Elements",
  };
  return rec[category] ?? category;
};

export type ImagePickerModalProps = DialogProps & {
  onPick?: (image: iImage) => void;
  category?: string;
};

const allTags = [
  ...new Set([...allImages.map((img) => img.category).filter((t) => !!t)]),
];

export default function ImagePickerModal({
  onPick,
  category: initalCategory,
  ...props
}: ImagePickerModalProps) {
  const [category, setCategory] = useState(initalCategory);
  const images = useMemo(() => {
    let images = allImages;
    if (category) {
      images = images.filter((img) => img.category === category);
    }
    return images;
  }, [category]);

  return (
    <Dialog {...props}>
      <DialogContent className="flex h-screen max-w-[1024px] flex-col justify-start gap-0 space-y-0 p-0 md:h-[calc(100%-4rem)]">
        <DialogHeader className="sticky top-0 z-20 space-y-0 border-b bg-card p-6">
          <DialogTitle>Add Image</DialogTitle>
          <div className="flex flex-wrap gap-2 pt-4">
            <Button
              variant="outline"
              className={cn({
                "bg-accent text-accent-foreground": category === "",
              })}
              onClick={() => setCategory("")}
              size="sm"
            >
              All Images
            </Button>
            {allTags.map((t) => (
              <Button
                key={t}
                variant="outline"
                size="sm"
                onClick={() => setCategory(t)}
                className={cn({
                  "bg-accent text-accent-foreground": category === t,
                })}
              >
                {categoryMapName(t)}
              </Button>
            ))}
          </div>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-2 gap-4 p-6 sm:grid-cols-3 md:grid-cols-4">
            {images.map((image) => (
              <Button
                key={image.id}
                variant="outline"
                className="aspect-square h-fit w-full rounded-lg p-2"
                onClick={() => {
                  onPick?.(image);
                  props.onOpenChange?.(false);
                }}
                style={{
                  background: `repeating-conic-gradient(hsl(var(--border)) 0% 25%, hsl(var(--background)) 0% 50%) 50% / 16px 16px`,
                }}
              >
                <Image
                  src={image.src}
                  alt={image.alt ?? image.id}
                  width={image.width}
                  height={image.height}
                  className="h-full w-full object-contain"
                />
              </Button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export const useImagePickerModal = (): [
  (props: ImagePickerModalProps) => ReactNode,
  boolean,
  Dispatch<SetStateAction<boolean>>,
] => {
  const [open, setOpen] = useState(false);

  const Modal = useCallback(
    (props: ImagePickerModalProps) => (
      <ImagePickerModal open={open} onOpenChange={setOpen} {...props} />
    ),
    [open],
  );

  return [Modal, open, setOpen];
};

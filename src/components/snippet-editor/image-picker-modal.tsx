"use client";

import {
  Dispatch,
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
    element: "Element",
  };
  return rec[category] ?? category;
};

export type ImagePickerModalProps = DialogProps & {
  onPick?: (image: iImage) => void;
};

const allTags = [
  ...new Set([...allImages.map((img) => img.category).filter((t) => !!t)]),
];

export default function ImagePickerModal({
  onPick,
  ...props
}: ImagePickerModalProps) {
  const [category, setCategory] = useState("");
  const images = useMemo(() => {
    let images = allImages;
    if (category) {
      images = images.filter((img) => img.category === category);
    }
    return images;
  }, [category]);

  return (
    <Dialog {...props}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Image</DialogTitle>
        </DialogHeader>
        <div className="flex flex-wrap gap-2">
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
        <div className="grid grid-cols-3 gap-4">
          {images.map((image) => (
            <Button
              key={image.id}
              variant="outline"
              className="aspect-square h-fit w-full p-2"
              onClick={() => {
                onPick?.(image);
                props.onOpenChange?.(false);
              }}
            >
              <Image
                src={image.src}
                alt={image.alt ?? image.id}
                className="h-full w-full object-contain"
                width={image.width}
                height={image.height}
              />
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export const useImagePickerModal = (): [
  (props: ImagePickerModalProps) => JSX.Element,
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

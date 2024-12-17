/* eslint-disable @next/next/no-img-element */
import { cn } from "@/lib/utils";

import { useImagePickerModal } from "./snippet-editor/image-picker-modal";
import { Button } from "./ui/button";

export default function ImagePicker({
  image,
  onImagePick,
  category,
  className,
}: {
  image?: string | null;
  onImagePick?: (image: string | null) => void;
  category?: string;
  className?: string;
}) {
  const [ImagePickerModal, , setImagePickerModalOpen] = useImagePickerModal();
  return (
    <>
      <Button
        className={cn(
          "relative w-full overflow-hidden transition-none",
          className,
        )}
        variant="outline"
        style={{
          backgroundImage: `repeating-conic-gradient(hsl(var(--border)) 0% 25%, hsl(var(--background)) 0% 50%) 50% / 16px 16px`,
        }}
        onClick={() => setImagePickerModalOpen(true)}
      >
        {image && (
          <img
            src={image}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
      </Button>

      <ImagePickerModal
        onPick={(image) => {
          onImagePick?.(image.src);
        }}
        category={category}
      />
    </>
  );
}

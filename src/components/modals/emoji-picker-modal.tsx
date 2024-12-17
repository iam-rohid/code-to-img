import { Dispatch, SetStateAction, useCallback, useState } from "react";
import { DialogProps } from "@radix-ui/react-dialog";
import EmojiPicker, { Theme } from "emoji-picker-react";
import { useTheme } from "next-themes";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

export type EmojiPickerModalProps = DialogProps & {
  onPick?: (emoji: string) => void;
};

export default function EmojiPickerModal({
  onPick,
  ...props
}: EmojiPickerModalProps) {
  const { resolvedTheme } = useTheme();
  return (
    <Dialog {...props}>
      <DialogContent className="w-fit p-0">
        <DialogHeader className="p-4 pb-0">
          <DialogTitle>Pick Emoji</DialogTitle>
        </DialogHeader>
        <EmojiPicker
          theme={resolvedTheme === "light" ? Theme.LIGHT : Theme.DARK}
          className="border-none shadow-none"
          previewConfig={{ showPreview: false }}
          onEmojiClick={(event) => {
            props.onOpenChange?.(false);
            onPick?.(event.emoji);
          }}
          skinTonesDisabled
          lazyLoadEmojis
        />
      </DialogContent>
    </Dialog>
  );
}

export const useEmojiPickerModal = (): [
  (props: EmojiPickerModalProps) => JSX.Element,
  boolean,
  Dispatch<SetStateAction<boolean>>,
] => {
  const [open, setOpen] = useState(false);

  const Modal = useCallback(
    (props: EmojiPickerModalProps) => (
      <EmojiPickerModal open={open} onOpenChange={setOpen} {...props} />
    ),
    [open],
  );

  return [Modal, open, setOpen];
};

import { Dispatch, SetStateAction, useCallback, useState } from "react";
import { DialogProps } from "@radix-ui/react-dialog";

import { Snippet } from "@/db/schema";
import RenameSnippetForm from "../forms/rename-snippet-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

export type RenameSnippetModalProps = DialogProps & {
  snippet: Snippet;
  onRenamed?: (updatedSippet: Snippet) => void;
};

export default function RenameSnippetModal({
  snippet,
  onRenamed,
  ...props
}: RenameSnippetModalProps) {
  return (
    <Dialog {...props}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename Snippet</DialogTitle>
        </DialogHeader>
        <RenameSnippetForm
          snippet={snippet}
          onCancel={() => props.onOpenChange?.(false)}
          onRenamed={(updatedSippet) => {
            props.onOpenChange?.(false);
            onRenamed?.(updatedSippet);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}

export const useRenameSnippetModal = (): [
  (props: RenameSnippetModalProps) => JSX.Element,
  boolean,
  Dispatch<SetStateAction<boolean>>,
] => {
  const [open, setOpen] = useState(false);

  const Modal = useCallback(
    (props: RenameSnippetModalProps) => (
      <RenameSnippetModal open={open} onOpenChange={setOpen} {...props} />
    ),
    [open],
  );

  return [Modal, open, setOpen];
};

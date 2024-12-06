import { Dispatch, SetStateAction, useCallback, useState } from "react";
import { DialogProps } from "@radix-ui/react-dialog";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

export type MyModalProps = DialogProps & {};

export default function MyModal({ ...props }: MyModalProps) {
  return (
    <Dialog {...props}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>My Modal</DialogTitle>
        </DialogHeader>
        <p>Modal Content</p>
      </DialogContent>
    </Dialog>
  );
}

export const useMyModal = (): [
  (props: MyModalProps) => JSX.Element,
  boolean,
  Dispatch<SetStateAction<boolean>>,
] => {
  const [open, setOpen] = useState(false);

  const Modal = useCallback(
    (props: MyModalProps) => (
      <MyModal open={open} onOpenChange={setOpen} {...props} />
    ),
    [open],
  );

  return [Modal, open, setOpen];
};

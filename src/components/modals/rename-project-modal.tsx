import { Dispatch, SetStateAction, useCallback, useState } from "react";
import { DialogProps } from "@radix-ui/react-dialog";

import { Project } from "@/db/schema";
import RenameProjectForm from "../forms/rename-project-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

export type RenameProjectModalProps = DialogProps & {
  project: Project;
  onRenamed?: (project: Project) => void;
};

export default function RenameProjectModal({
  project,
  onRenamed,
  ...props
}: RenameProjectModalProps) {
  return (
    <Dialog {...props}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename Project</DialogTitle>
        </DialogHeader>
        <RenameProjectForm
          project={project}
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

export const useRenameProjectModal = (): [
  (props: RenameProjectModalProps) => JSX.Element,
  boolean,
  Dispatch<SetStateAction<boolean>>,
] => {
  const [open, setOpen] = useState(false);

  const Modal = useCallback(
    (props: RenameProjectModalProps) => (
      <RenameProjectModal open={open} onOpenChange={setOpen} {...props} />
    ),
    [open],
  );

  return [Modal, open, setOpen];
};

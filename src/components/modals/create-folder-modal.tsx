"use client";

import { Dispatch, SetStateAction, useCallback, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogProps } from "@radix-ui/react-dialog";
import { Loader2Icon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Folder } from "@/db/schema";
import { useWorkspace } from "@/providers/workspace-provider";
import { trpc } from "@/trpc/client";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

export type CreateFolderModalProps = DialogProps & {
  onCreated?: (folder: Folder) => void;
  parentId?: string;
};

export default function CreateFolderModal({
  onCreated,
  parentId,
  ...props
}: CreateFolderModalProps) {
  return (
    <Dialog {...props}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Folder</DialogTitle>
        </DialogHeader>
        <CreateFolderForm
          parentId={parentId}
          onCreated={(folder) => {
            props.onOpenChange?.(false);
            onCreated?.(folder);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}

const schema = z.object({
  name: z.string().min(1, { message: "Name is required" }).max(100),
});

function CreateFolderForm({
  onCreated,
  parentId,
}: {
  onCreated?: (folder: Folder) => void;
  parentId?: string;
}) {
  const { workspace } = useWorkspace();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "Untitled",
    },
  });

  const utils = trpc.useUtils();
  const createFolderMut = trpc.folders.createFolder.useMutation({
    onSuccess: (folder, vars) => {
      toast.success("Folder created");
      utils.folders.getFolders.setData(
        { workspaceId: workspace.id, parentId: vars.parentId },
        (folders) => [folder, ...(folders ?? [])],
      );
      onCreated?.(folder);
    },
    onError: (error) => {
      toast.error("Failed to create folder", { description: error.message });
    },
  });

  const handleCreateFolder = useCallback(
    (data: z.infer<typeof schema>) => {
      createFolderMut.mutate({
        workspaceId: workspace.id,
        name: data.name,
        parentId,
      });
    },
    [createFolderMut, parentId, workspace.id],
  );

  return (
    <Form {...form}>
      <form
        className="grid gap-6"
        onSubmit={form.handleSubmit(handleCreateFolder)}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button disabled={createFolderMut.isPending}>
          {createFolderMut.isPending ? (
            <Loader2Icon className="animate-spin" />
          ) : null}
          Create Folder
        </Button>
      </form>
    </Form>
  );
}

export const useCreateFolderModal = (): [
  (props: CreateFolderModalProps) => JSX.Element,
  boolean,
  Dispatch<SetStateAction<boolean>>,
] => {
  const [open, setOpen] = useState(false);

  const Modal = useCallback(
    (props: CreateFolderModalProps) => (
      <CreateFolderModal open={open} onOpenChange={setOpen} {...props} />
    ),
    [open],
  );

  return [Modal, open, setOpen];
};

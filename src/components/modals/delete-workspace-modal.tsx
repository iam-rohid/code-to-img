"use client";

import {
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useState,
} from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogProps } from "@radix-ui/react-dialog";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { useWorkspace } from "@/providers/workspace-provider";
import { trpc } from "@/trpc/client";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

export type DeleteWorkspaceModalProps = DialogProps & {};

export default function DeleteWorkspaceModal({
  ...props
}: DeleteWorkspaceModalProps) {
  return (
    <Dialog {...props}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Workspace</DialogTitle>
          <DialogDescription>
            Warning: This will permanently delete your workspace, snippets, and
            all associated data.
          </DialogDescription>
        </DialogHeader>
        <ConfirmationForm />
      </DialogContent>
    </Dialog>
  );
}

const schema = z.object({
  slug: z.string(),
  text: z.string(),
});

const confirmText = "confirm delete workspace";

function ConfirmationForm() {
  const { workspace } = useWorkspace();
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      slug: "",
      text: "",
    },
  });

  const router = useRouter();

  const deleteWorkspaceMut = trpc.workspaces.deleteWorkspace.useMutation({
    onSuccess: () => {
      router.push("/");
      toast.success("Workspace deleted.");
    },
    onError: (error) => {
      toast.error("Failed to delete account", { description: error.message });
    },
  });

  const handleSubmit = useCallback(
    (data: z.infer<typeof schema>) => {
      if (data.slug !== workspace.slug) {
        form.setError("slug", {
          message: `Please type "${workspace.slug}" to verify.`,
        });
        return;
      }
      if (data.text !== confirmText) {
        form.setError("text", {
          message: `Please type "${confirmText}" to verify.`,
        });
        return;
      }
      deleteWorkspaceMut.mutate({ workspaceId: workspace.id });
    },
    [deleteWorkspaceMut, form, workspace.id, workspace.slug],
  );

  return (
    <Form {...form}>
      <form className="grid gap-6" onSubmit={form.handleSubmit(handleSubmit)}>
        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Enter the workspace slug <b>{workspace.slug}</b> to continue:
              </FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                To verify, type <b>{confirmText}</b> below
              </FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button variant="destructive" disabled={deleteWorkspaceMut.isPending}>
          {deleteWorkspaceMut.isPending && <Loader2 className="animate-spin" />}
          Cofirm delete workspace
        </Button>
      </form>
    </Form>
  );
}

export const useDeleteWorkspaceModal = (): [
  (props: DeleteWorkspaceModalProps) => ReactNode,
  boolean,
  Dispatch<SetStateAction<boolean>>,
] => {
  const [open, setOpen] = useState(false);

  const Modal = useCallback(
    (props: DeleteWorkspaceModalProps) => (
      <DeleteWorkspaceModal open={open} onOpenChange={setOpen} {...props} />
    ),
    [open],
  );

  return [Modal, open, setOpen];
};

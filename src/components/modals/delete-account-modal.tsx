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

export type DeleteAccountModalProps = DialogProps & {};

export default function DeleteAccountModal({
  ...props
}: DeleteAccountModalProps) {
  return (
    <Dialog {...props}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Account</DialogTitle>
          <DialogDescription>
            Warning: This will permanently delete your account, all your
            workspaces, and all your snippets.
          </DialogDescription>
        </DialogHeader>
        <ConfirmationForm />
      </DialogContent>
    </Dialog>
  );
}

const schema = z.object({
  text: z.string(),
});

const confirmText = "confirm delete account";

function ConfirmationForm() {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      text: "",
    },
  });

  const router = useRouter();

  const deleteAccountMut = trpc.users.deleteAccount.useMutation({
    onSuccess: () => {
      router.refresh();
      toast.success("Account deleted.");
    },
    onError: (error) => {
      toast.error("Failed to delete account", { description: error.message });
    },
  });

  const handleSubmit = useCallback(
    (data: z.infer<typeof schema>) => {
      if (data.text !== confirmText) {
        form.setError("text", {
          message: `Please type "${confirmText}" to verify.`,
        });
        return;
      }
      deleteAccountMut.mutate();
    },
    [deleteAccountMut, form],
  );

  return (
    <Form {...form}>
      <form className="grid gap-6" onSubmit={form.handleSubmit(handleSubmit)}>
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
        <Button variant="destructive" disabled={deleteAccountMut.isPending}>
          {deleteAccountMut.isPending && <Loader2 className="animate-spin" />}
          Cofirm delete account
        </Button>
      </form>
    </Form>
  );
}

export const useDeleteAccountModal = (): [
  (props: DeleteAccountModalProps) => ReactNode,
  boolean,
  Dispatch<SetStateAction<boolean>>,
] => {
  const [open, setOpen] = useState(false);

  const Modal = useCallback(
    (props: DeleteAccountModalProps) => (
      <DeleteAccountModal open={open} onOpenChange={setOpen} {...props} />
    ),
    [open],
  );

  return [Modal, open, setOpen];
};

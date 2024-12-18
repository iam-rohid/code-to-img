"use client";

import { Dispatch, SetStateAction, useCallback, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogProps } from "@radix-ui/react-dialog";
import { Loader2Icon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Snippet } from "@/db/schema";
import { SYSTEM_SNIPPET_TEMPLATES } from "@/lib/constants/templates";
import { cn } from "@/lib/utils";
import { useWorkspace } from "@/providers/workspace-provider";
import { trpc } from "@/trpc/client";
import SnippetViewer from "../snippet-editor/snippet-viewer";
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

export type CreateSnippetModalProps = DialogProps & {
  onCreated?: (snippet: Snippet) => void;
  projectId?: string | null;
};

export default function CreateSnippetModal({
  onCreated,
  projectId,
  ...props
}: CreateSnippetModalProps) {
  return (
    <Dialog {...props}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Snippet</DialogTitle>
        </DialogHeader>
        <CreateSnippetForm
          projectId={projectId}
          onCreated={(snippet) => {
            props.onOpenChange?.(false);
            onCreated?.(snippet);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}

const schema = z.object({
  name: z.string(),
  templeteId: z.string(),
});

function CreateSnippetForm({
  onCreated,
  projectId,
}: {
  onCreated?: (snippet: Snippet) => void;
  projectId?: string | null;
}) {
  const { workspace } = useWorkspace();
  const [templates] = useState(SYSTEM_SNIPPET_TEMPLATES);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "Cool Snippet!",
      templeteId: "default",
    },
  });

  const utils = trpc.useUtils();
  const createSnippetMut = trpc.snippets.createSnippet.useMutation({
    onSuccess: (snippet, vars) => {
      toast.success("Snippet created");
      utils.snippets.getSnippets.setData(
        {
          workspaceId: workspace.id,
          trashed: false,
          projectId: vars.dto.projectId,
        },
        (snippets) => [snippet, ...(snippets ?? [])],
      );
      utils.snippets.getSnippet.setData({ snippetId: snippet.id }, snippet);
      onCreated?.(snippet);
    },
    onError: (error) => {
      toast.error("Failed to create snippet", { description: error.message });
    },
  });

  const handleCreateSnippet = useCallback(
    (data: z.infer<typeof schema>) => {
      const template = templates.find(
        (template) => template.id === data.templeteId,
      );
      if (!template) {
        form.setError("templeteId", { message: "Template not found!" });
        return;
      }
      createSnippetMut.mutate({
        workspaceId: workspace.id,
        dto: { title: data.name, data: template.data, projectId },
      });
    },
    [createSnippetMut, form, projectId, templates, workspace.id],
  );

  return (
    <Form {...form}>
      <form
        className="grid gap-6"
        onSubmit={form.handleSubmit(handleCreateSnippet)}
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

        <FormField
          control={form.control}
          name="templeteId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Template</FormLabel>
              <FormControl>
                <div className="grid grid-cols-2 gap-4">
                  {templates.map((template) => (
                    <div
                      key={template.id}
                      className={cn(
                        "group relative rounded-xl border text-muted-foreground transition-shadow hover:shadow-lg",
                        {
                          "border-primary text-accent-foreground":
                            template.id === field.value,
                        },
                      )}
                    >
                      <button
                        type="button"
                        className="absolute inset-0 z-10 rounded-xl ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        onClick={() =>
                          form.setValue(field.name, template.id, {
                            shouldDirty: true,
                          })
                        }
                      />

                      <div className="p-2 pb-0">
                        <SnippetViewer
                          data={template.data}
                          className="aspect-[3/2] overflow-hidden rounded-lg bg-secondary"
                        />
                      </div>
                      <div className="p-2 text-center">
                        <p className="text-sm font-semibold">{template.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button disabled={createSnippetMut.isPending}>
          {createSnippetMut.isPending ? (
            <Loader2Icon className="animate-spin" />
          ) : null}
          Create Snippet
        </Button>
      </form>
    </Form>
  );
}

export const useCreateSnippetModal = (): [
  (props: CreateSnippetModalProps) => JSX.Element,
  boolean,
  Dispatch<SetStateAction<boolean>>,
] => {
  const [open, setOpen] = useState(false);

  const Modal = useCallback(
    (props: CreateSnippetModalProps) => (
      <CreateSnippetModal open={open} onOpenChange={setOpen} {...props} />
    ),
    [open],
  );

  return [Modal, open, setOpen];
};

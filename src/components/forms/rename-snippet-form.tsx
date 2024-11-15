import { useCallback } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Snippet } from "@/db/schema";
import { trpc } from "@/trpc/client";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

const schema = z.object({
  title: z.string().min(1).max(100),
});

export interface RenameSnippetFormProps {
  snippet: Snippet;
  onCancel?: () => void;
  onRenamed?: (snippet: Snippet) => void;
}

export default function RenameSnippetForm({
  snippet,
  onRenamed,
  onCancel,
}: RenameSnippetFormProps) {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: snippet.title,
    },
  });

  const utils = trpc.useUtils();

  const updateSnippetMut = trpc.snippets.updateSnippet.useMutation({
    onSuccess: (updatedSnippet) => {
      onRenamed?.(updatedSnippet);
      toast.success("Snippet renamed");
      utils.snippets.getSnippet.invalidate({ snippetId: snippet.id });
    },
    onError: (error) => {
      toast.error("Failed to rename snippet", { description: error.message });
    },
  });

  const onSubmit = useCallback(
    (data: z.infer<typeof schema>) => {
      updateSnippetMut.mutate({
        snippetId: snippet.id,
        dto: { title: data.title },
      });
    },
    [snippet.id, updateSnippetMut],
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2">
          <Button
            type="reset"
            variant="ghost"
            onClick={onCancel}
            disabled={updateSnippetMut.isPending}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={updateSnippetMut.isPending}>
            {updateSnippetMut.isPending ? (
              <Loader2Icon className="animate-spin" />
            ) : null}
            Rename
          </Button>
        </div>
      </form>
    </Form>
  );
}

"use client";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CreateWorkspaceDTO, createWorkspaceDto } from "@/trpc/validators";
import { trpc } from "@/trpc/client";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { APP_NAME } from "@/lib/constants";

export default function CreateWorkspaceForm() {
  const form = useForm<CreateWorkspaceDTO>({
    resolver: zodResolver(createWorkspaceDto),
    defaultValues: {
      name: "",
      slug: "",
    },
  });
  const router = useRouter();

  const utils = trpc.useUtils();
  const createWorkspaceMut = trpc.workspaces.createWorkspace.useMutation({
    onSuccess: (data) => {
      toast("Workspace created");
      void utils.workspaces.getWorkspaces.invalidate();
      router.push(`/${data.slug}`);
    },
    onError: (error) => {
      toast("Failed to create workspace!", { description: error.message });
    },
  });

  return (
    <Form {...form}>
      <form
        className="grid gap-6"
        onSubmit={form.handleSubmit((data) => {
          createWorkspaceMut.mutate(data);
        })}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Workspace Name</FormLabel>
              <FormControl>
                <Input placeholder="My org" {...field} />
              </FormControl>
              <FormDescription>
                This is the name of your workspace on {APP_NAME}.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Workspace Slug</FormLabel>
              <div className="flex">
                <div className="h-10 px-3 bg-secondary border border-r-0 rounded-md rounded-r-none flex items-center text-sm text-muted-foreground">
                  <p>rowdash.com/</p>
                </div>
                <FormControl>
                  <Input
                    placeholder="myorg"
                    {...field}
                    className="rounded-l-none"
                  />
                </FormControl>
              </div>
              <FormDescription>
                This is your workspace&apos;s unique slug on {APP_NAME}.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button disabled={createWorkspaceMut.isPending}>
          {createWorkspaceMut.isPending ? (
            <Loader2 className="animate-spin" />
          ) : (
            "Create Workspace"
          )}
        </Button>
      </form>
    </Form>
  );
}

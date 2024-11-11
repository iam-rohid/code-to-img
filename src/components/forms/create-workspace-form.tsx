"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { APP_NAME } from "@/lib/constants";
import { trpc } from "@/trpc/client";
import { CreateWorkspaceDTO, createWorkspaceDto } from "@/validators";

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
                <div className="flex h-10 items-center rounded-md rounded-r-none border border-r-0 bg-secondary px-3 text-sm text-muted-foreground">
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

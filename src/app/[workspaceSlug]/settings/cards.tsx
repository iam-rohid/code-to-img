"use client";

import { useCallback, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckIcon, CopyIcon, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { APP_NAME } from "@/lib/constants";
import { useWorkspace } from "@/providers/workspace-provider";
import { trpc } from "@/trpc/client";
import { UpdateWorkspaceDTO, updateWorkspaceDto } from "@/validators";

export function WorkspaceNameCard() {
  const { workspace } = useWorkspace();

  const form = useForm<UpdateWorkspaceDTO>({
    resolver: zodResolver(updateWorkspaceDto),
    defaultValues: {
      name: workspace.name,
    },
  });

  const utils = trpc.useUtils();
  const updateWorkspaceMut = trpc.workspaces.updateWorkspace.useMutation({
    onSuccess: (data) => {
      form.reset({ name: data.name });
      void utils.workspaces.getWorkspaceBySlug.invalidate({
        slug: workspace.slug,
      });
      void utils.workspaces.getWorkspaces.invalidate();
      toast("Workspace name updated.");
    },
    onError: (error) => {
      form.reset();
      toast("Failed to update name!", { description: error.message });
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Workspace Name</CardTitle>
        <CardDescription>
          This is the name of your workspace on {APP_NAME}.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) =>
            updateWorkspaceMut.mutate({
              workspaceId: workspace.id,
              dto: { name: data.name },
            }),
          )}
        >
          <CardContent>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="My org" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button disabled={!form.formState.isDirty}>
              {updateWorkspaceMut.isPending && (
                <Loader2 className="-ml-1 mr-2 h-4 w-4 animate-spin" />
              )}
              Save
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

export function WorkspaceSlugCard() {
  const { workspace } = useWorkspace();
  const router = useRouter();

  const form = useForm<UpdateWorkspaceDTO>({
    resolver: zodResolver(updateWorkspaceDto),
    defaultValues: {
      slug: workspace.slug,
    },
  });

  const utils = trpc.useUtils();
  const updateWorkspaceMut = trpc.workspaces.updateWorkspace.useMutation({
    onSuccess: (data) => {
      form.reset({ slug: data.slug });
      void utils.workspaces.getWorkspaces.invalidate();
      toast("Workspace slug updated.");
      router.push(`/${data.slug}/settings`);
    },
    onError: (error) => {
      form.reset();
      toast("Failed to update slug!", { description: error.message });
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Workspace Slug</CardTitle>
        <CardDescription>
          This is your workspace&apos;s unique slug on {APP_NAME}.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) =>
            updateWorkspaceMut.mutate({
              workspaceId: workspace.id,
              dto: { slug: data.slug },
            }),
          )}
        >
          <CardContent>
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="myorg" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button disabled={!form.formState.isDirty}>
              {updateWorkspaceMut.isPending && (
                <Loader2 className="-ml-1 mr-2 h-4 w-4 animate-spin" />
              )}
              Save
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

export function WorkspaceIdCard() {
  const { workspace } = useWorkspace();
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    if (copied) {
      return;
    }

    await window.navigator.clipboard.writeText(workspace.id);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  }, [copied, workspace.id]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Workspace Id</CardTitle>
        <CardDescription>
          Unique ID of your workspace on {APP_NAME}.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <fieldset className="relative">
          <Input defaultValue={workspace.id} readOnly />
          <Button
            size="icon"
            variant="ghost"
            className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2"
            onClick={handleCopy}
          >
            {copied ? (
              <CheckIcon className="h-4 w-4" />
            ) : (
              <CopyIcon className="h-4 w-4" />
            )}
          </Button>
        </fieldset>
      </CardContent>
    </Card>
  );
}

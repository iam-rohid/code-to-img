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
import { LoaderCircleIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Project } from "@/db/schema";
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

export type CreateProjectModalProps = DialogProps & {
  onCreated?: (project: Project) => void;
};

export default function CreateProjectModal({
  onCreated,
  ...props
}: CreateProjectModalProps) {
  return (
    <Dialog {...props}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Project</DialogTitle>
        </DialogHeader>
        <CreateProjectForm
          onCreated={(project) => {
            props.onOpenChange?.(false);
            onCreated?.(project);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}

const schema = z.object({
  name: z.string().min(1, { message: "Name is required" }).max(100),
});

function CreateProjectForm({
  onCreated,
}: {
  onCreated?: (project: Project) => void;
}) {
  const { workspace } = useWorkspace();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "Untitled",
    },
  });

  const utils = trpc.useUtils();
  const createProjectMut = trpc.projects.createProject.useMutation({
    onMutate: () => {
      const toastId = toast.loading("Creating project...");
      return { toastId };
    },
    onSuccess: (project, _vars, ctx) => {
      toast.success("Project created", { id: ctx.toastId });
      utils.projects.getAllProjects.setData(
        { workspaceId: workspace.id },
        (projects) => [project, ...(projects ?? [])],
      );
      utils.projects.getProject.setData(
        { projectId: project.id, workspaceId: project.workspaceId },
        project,
      );
      onCreated?.(project);
    },
    onError: (error, _vars, ctx) => {
      toast.error("Failed to create project", {
        description: error.message,
        id: ctx?.toastId,
      });
    },
  });

  const handleCreateProject = useCallback(
    (data: z.infer<typeof schema>) => {
      createProjectMut.mutate({
        workspaceId: workspace.id,
        name: data.name,
      });
    },
    [createProjectMut, workspace.id],
  );

  return (
    <Form {...form}>
      <form
        className="grid gap-6"
        onSubmit={form.handleSubmit(handleCreateProject)}
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

        <Button disabled={createProjectMut.isPending}>
          {createProjectMut.isPending ? (
            <LoaderCircleIcon className="animate-spin" />
          ) : null}
          Create Project
        </Button>
      </form>
    </Form>
  );
}

export const useCreateProjectModal = (): [
  (props: CreateProjectModalProps) => ReactNode,
  boolean,
  Dispatch<SetStateAction<boolean>>,
] => {
  const [open, setOpen] = useState(false);

  const Modal = useCallback(
    (props: CreateProjectModalProps) => (
      <CreateProjectModal open={open} onOpenChange={setOpen} {...props} />
    ),
    [open],
  );

  return [Modal, open, setOpen];
};

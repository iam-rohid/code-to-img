import { useCallback } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Project } from "@/db/schema";
import { useUpdateProjectMutation } from "@/hooks/project-mutations";
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
  name: z.string().min(1).max(100),
});

export interface RenameProjectFormProps {
  project: Project;
  onCancel?: () => void;
  onRenamed?: (project: Project) => void;
}

export default function RenameProjectForm({
  project,
  onRenamed,
  onCancel,
}: RenameProjectFormProps) {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: project.name,
    },
  });

  const updateProjectMut = useUpdateProjectMutation();

  const onSubmit = useCallback(
    (data: z.infer<typeof schema>) => {
      updateProjectMut.mutate(
        {
          projectId: project.id,
          workspaceId: project.workspaceId,
          dto: { name: data.name },
        },
        {
          onSuccess: (data) => onRenamed?.(data),
        },
      );
    },
    [onRenamed, project.id, project.workspaceId, updateProjectMut],
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Name</FormLabel>
              <FormControl>
                <Input {...field} />
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
            disabled={updateProjectMut.isPending}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={updateProjectMut.isPending}>
            {updateProjectMut.isPending ? (
              <Loader2Icon className="animate-spin" />
            ) : null}
            Rename
          </Button>
        </div>
      </form>
    </Form>
  );
}

import { z } from "zod";

const takenSlugs = [
  "settings",
  "app",
  "apps",
  "workspace",
  "workspaces",
  "domain",
  "analytics",
  "events",
  "pages",
  "page",
  "home",
  "www",
  "admin",
];

export const createWorkspaceDto = z.object({
  name: z.string().min(1, "Name is required.").max(100),
  slug: z
    .string()
    .min(1, "Slug is required.")
    .max(100)
    .regex(/^[a-z0-9]+(?:(?:-|_)[a-z0-9]+)*$/, { message: "Invalid slug" })
    .refine(
      (value) => !takenSlugs.includes(value),
      "This slug already exists.",
    ),
});
export type CreateWorkspaceDTO = z.infer<typeof createWorkspaceDto>;

export const updateWorkspaceDto = createWorkspaceDto.partial();
export type UpdateWorkspaceDTO = z.infer<typeof updateWorkspaceDto>;

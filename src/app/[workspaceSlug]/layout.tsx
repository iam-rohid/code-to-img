import { type ReactNode } from "react";
import { notFound } from "next/navigation";

import { hasAccessToWorkspaceSlug } from "@/lib/server/getters";
import WorkspaceProvider from "@/providers/workspace-provider";
import { HydrateClient, trpc } from "@/trpc/server";

export default async function Layout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ workspaceSlug: string }>;
}) {
  const { workspaceSlug } = await params;

  if (!(await hasAccessToWorkspaceSlug(workspaceSlug))) {
    notFound();
  }

  trpc.workspaces.getWorkspaceBySlug.prefetch({ slug: workspaceSlug });

  return (
    <HydrateClient>
      <WorkspaceProvider>{children}</WorkspaceProvider>
    </HydrateClient>
  );
}

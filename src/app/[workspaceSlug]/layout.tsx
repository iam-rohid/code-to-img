import { ReactNode } from "react";
import { notFound } from "next/navigation";

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

  try {
    const workspace = await trpc.workspaces.getWorkspaceBySlug({
      slug: workspaceSlug,
    });
    trpc.workspaces.getWorkspaceBySlug.prefetch(
      { slug: workspace.workspace.slug },
      { initialData: workspace },
    );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    notFound();
  }

  return (
    <HydrateClient>
      <WorkspaceProvider>{children}</WorkspaceProvider>
    </HydrateClient>
  );
}

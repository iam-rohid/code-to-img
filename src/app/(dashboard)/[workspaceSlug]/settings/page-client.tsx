"use client";

import AppBar from "@/components/app-bar";
import { useWorkspace } from "@/providers/workspace-provider";

import { WorkspaceIdCard, WorkspaceNameCard, WorkspaceSlugCard } from "./cards";

export default function PageClient() {
  const { workspace } = useWorkspace();

  return (
    <>
      <AppBar
        links={[
          { title: workspace.name, url: `/${workspace.slug}` },
          { title: "Settings", url: `/${workspace.slug}/settings` },
        ]}
        title="General"
      />
      <div className="container mx-auto my-16 max-w-screen-md space-y-8 px-4 md:px-8">
        <WorkspaceIdCard />
        <WorkspaceNameCard />
        <WorkspaceSlugCard />
      </div>
    </>
  );
}

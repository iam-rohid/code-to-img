"use client";

import AppBar from "@/components/app-bar";
import { useWorkspace } from "@/providers/workspace-provider";

import TrashList from "./trash-list";

export default function PageClient() {
  const { workspace } = useWorkspace();
  return (
    <>
      <AppBar
        links={[{ title: workspace.name, url: `/${workspace.slug}` }]}
        title="Trash"
      />
      <TrashList />
    </>
  );
}

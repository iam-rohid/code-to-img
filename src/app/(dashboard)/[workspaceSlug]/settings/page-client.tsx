"use client";

import AppBar from "@/components/app-bar";
import { useDeleteWorkspaceModal } from "@/components/modals/delete-workspace-modal";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useWorkspace } from "@/providers/workspace-provider";

import { WorkspaceIdCard, WorkspaceNameCard, WorkspaceSlugCard } from "./cards";

export default function PageClient() {
  const { workspace } = useWorkspace();

  return (
    <>
      <AppBar
        links={[{ title: "Settings", url: `/${workspace.slug}/settings` }]}
        title="General"
      />
      <div className="container mx-auto my-16 max-w-screen-lg space-y-8 px-4 md:px-8">
        <WorkspaceIdCard />
        <WorkspaceNameCard />
        <WorkspaceSlugCard />
        <DeleteWorkspaceCard />
      </div>
    </>
  );
}

export function DeleteWorkspaceCard() {
  const [Modal, , setOpen] = useDeleteWorkspaceModal();

  return (
    <Card className="border-destructive">
      <CardHeader>
        <CardTitle>Delete Workspace</CardTitle>
        <CardDescription>
          Permanently delete your workspace, snippets, and all associated data.
          This action cannot be undone - please proceed with caution.
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Button variant="destructive" onClick={() => setOpen(true)}>
          Delete Workspace
        </Button>
      </CardFooter>
      <Modal />
    </Card>
  );
}

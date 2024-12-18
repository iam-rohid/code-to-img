"use client";

import AppBar from "@/components/app-bar";
import { ProjectList } from "@/components/project-list";
import { SnippetList, SnippetListSkeleton } from "@/components/snippet-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWorkspace } from "@/providers/workspace-provider";
import { trpc } from "@/trpc/client";

export default function PageClient() {
  return (
    <Tabs defaultValue="snippets">
      <AppBar
        title="Trash"
        leading={
          <TabsList>
            <TabsTrigger value="snippets">Snippets</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
          </TabsList>
        }
      />

      <TabsContent value="snippets">
        <TrashedSnippetList />
      </TabsContent>
      <TabsContent value="projects">
        <TrashedProjectList />
      </TabsContent>
    </Tabs>
  );
}

function TrashedSnippetList() {
  const { workspace } = useWorkspace();
  const snippetsQuery = trpc.snippets.getTrashedSnippets.useQuery({
    workspaceId: workspace.id,
  });

  return (
    <div className="mx-auto my-16 w-full max-w-screen-xl space-y-8 px-4">
      {snippetsQuery.isPending ? (
        <SnippetListSkeleton />
      ) : snippetsQuery.isError ? (
        <p>{snippetsQuery.error.message}</p>
      ) : snippetsQuery.data.length < 1 ? (
        <p>You don&apos;t have any trashed snippets</p>
      ) : (
        <SnippetList snippets={snippetsQuery.data} />
      )}
    </div>
  );
}
function TrashedProjectList() {
  const { workspace } = useWorkspace();
  const projectsQuery = trpc.projects.getTrashedProjects.useQuery({
    workspaceId: workspace.id,
  });

  return (
    <div className="mx-auto my-16 w-full max-w-screen-xl space-y-8 px-4">
      {projectsQuery.isPending ? (
        <SnippetListSkeleton />
      ) : projectsQuery.isError ? (
        <p>{projectsQuery.error.message}</p>
      ) : projectsQuery.data.length < 1 ? (
        <p>You don&apos;t have any trashed projects</p>
      ) : (
        <ProjectList projects={projectsQuery.data} />
      )}
    </div>
  );
}

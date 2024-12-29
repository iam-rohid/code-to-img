"use client";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { ChevronLeftIcon, LayoutDashboardIcon, PlusIcon } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";

import { useCreateSnippetModal } from "@/components/modals/create-snippet-modal";
import { SnippetSidebarItem } from "@/components/snippet-card";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import UserButton from "@/components/user-button";
import WorkspaceSwitcher from "@/components/workspace-switcher";
import { getSnippetUrl } from "@/lib/utils";
import { useWorkspace } from "@/providers/workspace-provider";
import { trpc } from "@/trpc/client";

dayjs.extend(relativeTime);

export default function EditorSidebar() {
  const { workspace } = useWorkspace();
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId");

  const snippetsQuery = trpc.snippets.getSnippets.useQuery({
    workspaceId: workspace.id,
    projectId,
  });
  const projectQuery = trpc.projects.getProject.useQuery(
    { projectId: projectId ?? "", workspaceId: workspace.id },
    { enabled: !!projectId },
  );

  const [CreateSnippetModal, , setCreateSnippetModalOpen] =
    useCreateSnippetModal();

  const { snippetId } = useParams<{ snippetId: string }>();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarHeader>
          <div className="flex items-center px-2">
            <div className="flex-1">
              <Link href="/" className="flex items-center font-semibold">
                <ChevronLeftIcon className="mr-2 h-4 w-4" />
                Editor
              </Link>
            </div>
            <UserButton />
          </div>
          <WorkspaceSwitcher />
        </SidebarHeader>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href={`/${workspace.slug}`}>
                    <LayoutDashboardIcon />
                    Dashboard
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>
            {projectId ? (projectQuery.data?.name ?? "Loading...") : "Snippets"}
          </SidebarGroupLabel>
          <SidebarGroupAction onClick={() => setCreateSnippetModalOpen(true)}>
            <PlusIcon />
          </SidebarGroupAction>
          <SidebarGroupContent>
            <SidebarMenu>
              {snippetsQuery.isPending ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton className="h-20 w-full" key={i} />
                ))
              ) : snippetsQuery.isError ? (
                <p>{snippetsQuery.error.message}</p>
              ) : (
                snippetsQuery.data.map((snippet) => (
                  <SnippetSidebarItem
                    snippet={snippet}
                    key={snippet.id}
                    isActive={snippet.id === snippetId}
                  />
                ))
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <CreateSnippetModal
        projectId={projectId}
        onCreated={(snippet) => {
          router.push(getSnippetUrl(snippet, workspace.slug));
        }}
      />
    </Sidebar>
  );
}

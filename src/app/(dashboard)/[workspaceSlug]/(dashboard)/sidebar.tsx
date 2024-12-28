"use client";

import { useCallback, useMemo } from "react";
import dayjs from "dayjs";
import {
  Clock3Icon,
  FileIcon,
  FolderIcon,
  LayoutGridIcon,
  Loader2,
  LucideIcon,
  MoreVerticalIcon,
  SettingsIcon,
  TrashIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import SnippetViewer from "@/components/snippet-editor/snippet-viewer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import UserButton from "@/components/user-button";
import WorkspaceSwitcher from "@/components/workspace-switcher";
import { useRemoveProjectFromSidebarMutation } from "@/hooks/project-mutations";
import { useRemoveSnippetFromSidebarMutation } from "@/hooks/snippet-mutations";
import { useWorkspace } from "@/providers/workspace-provider";
import { RouterOutput } from "@/trpc";
import { trpc } from "@/trpc/client";

export default function WorkspcaeSidebar() {
  const { workspace } = useWorkspace();
  const pathname = usePathname();

  const starsQuery = trpc.stars.getAllStars.useQuery({
    workspaceId: workspace.id,
  });
  const removeSnippetFromSidebarMut = useRemoveSnippetFromSidebarMutation();
  const removeProjectFromSidebarMut = useRemoveProjectFromSidebarMutation();

  const handleRemoveItemfromSidebar = useCallback(
    (item: RouterOutput["stars"]["getAllStars"][number]) => {
      if (item.type === "snippet") {
        removeSnippetFromSidebarMut.mutate({
          snippetId: item.id,
          workspaceId: item.workspaceId,
        });
      } else {
        removeProjectFromSidebarMut.mutate({
          projectId: item.id,
          workspaceId: item.workspaceId,
        });
      }
    },
    [removeProjectFromSidebarMut, removeSnippetFromSidebarMut],
  );

  const items = useMemo(
    (): {
      id: string;
      label?: string;
      items: {
        title: string;
        url: string;
        icon: LucideIcon;
        exact?: boolean;
      }[];
    }[] => [
      {
        id: "menu",
        items: [
          {
            title: "Recents",
            url: `/${workspace.slug}/recents`,
            icon: Clock3Icon,
            exact: true,
          },
          {
            title: "Drafts",
            url: `/${workspace.slug}/drafts`,
            icon: FileIcon,
            exact: true,
          },
          {
            title: "All Projects",
            url: `/${workspace.slug}/projects`,
            icon: LayoutGridIcon,
            exact: true,
          },
          {
            title: "Trash",
            url: `/${workspace.slug}/trash`,
            icon: TrashIcon,
            exact: true,
          },
          {
            title: "Settings",
            url: `/${workspace.slug}/settings`,
            icon: SettingsIcon,
          },
        ],
      },
    ],
    [workspace.slug],
  );

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarHeader>
          <div className="flex items-center px-2">
            <div className="flex-1">
              <Link
                href={`/${workspace.slug}/recents`}
                className="flex h-10 w-10 items-center justify-center"
              >
                <Image
                  src="/images/code-to-img.svg"
                  alt="codetoimg logo"
                  width={48}
                  height={48}
                  className="h-8 w-8"
                />
              </Link>
            </div>
            <UserButton />
          </div>
          <WorkspaceSwitcher />
        </SidebarHeader>
        {items.map((group) => (
          <SidebarGroup key={group.id}>
            {group.label && (
              <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={
                        item.exact
                          ? pathname === item.url
                          : pathname.startsWith(item.url)
                      }
                    >
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}

        {starsQuery.isSuccess && starsQuery.data.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Stars</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {starsQuery.data.map((star) => {
                  const url =
                    star.type === "project"
                      ? `/${workspace.slug}/projects/${star.id}`
                      : `/${workspace.slug}/editor/${star.id}`;
                  const isActive = pathname === url;

                  return (
                    <SidebarMenuItem key={star.id}>
                      <Tooltip delayDuration={1000} disableHoverableContent>
                        <TooltipTrigger asChild>
                          <SidebarMenuButton asChild isActive={isActive}>
                            <Link href={url}>
                              {star.type === "project" ? (
                                <FolderIcon />
                              ) : (
                                <FileIcon />
                              )}
                              <span>{star.name}</span>
                            </Link>
                          </SidebarMenuButton>
                        </TooltipTrigger>
                        {star.type === "snippet" && (
                          <TooltipContent
                            side="right"
                            align="start"
                            className="block rounded-lg p-0"
                          >
                            <SnippetHoverCardContent
                              snippetId={star.id}
                              workspaceId={star.workspaceId}
                            />
                          </TooltipContent>
                        )}
                      </Tooltip>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <SidebarMenuAction>
                            <MoreVerticalIcon />
                          </SidebarMenuAction>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent side="right" align="start">
                          <DropdownMenuItem asChild>
                            <Link href={url}>Open</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleRemoveItemfromSidebar(star)}
                          >
                            Remove from Sidebar
                          </DropdownMenuItem>
                          {star.type === "snippet" && (
                            <DropdownMenuItem asChild>
                              <Link
                                href={
                                  star.projectId
                                    ? `/${workspace.slug}/projects/${star.projectId}`
                                    : `/${workspace.slug}/drafts`
                                }
                              >
                                Show in project
                              </Link>
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
}

function SnippetHoverCardContent({
  snippetId,
  workspaceId,
}: {
  snippetId: string;
  workspaceId: string;
}) {
  const snippetQuery = trpc.snippets.getSnippet.useQuery({
    snippetId,
    workspaceId,
  });

  if (snippetQuery.isPending) {
    return (
      <div className="flex h-32 w-64 items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (snippetQuery.isError) {
    return (
      <div className="w-64 p-4 text-muted-foreground">
        <p>{snippetQuery.error.message}</p>
      </div>
    );
  }

  return (
    <div className="w-64">
      <div className="p-1 pb-0">
        <SnippetViewer
          data={snippetQuery.data.data}
          className="aspect-[3/2] overflow-hidden rounded-md bg-secondary"
        />
      </div>
      <div className="p-2">
        <p className="truncate text-sm font-semibold">
          {snippetQuery.data.title}
        </p>
        <p className="truncate text-xs text-muted-foreground">
          Edited {dayjs(snippetQuery.data.lastSeenAt).fromNow()}
        </p>
      </div>
    </div>
  );
}

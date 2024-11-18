"use client";

import { useMemo } from "react";
import {
  ChevronLeftIcon,
  HomeIcon,
  LucideIcon,
  SettingsIcon,
  TrashIcon,
} from "lucide-react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import UserButton from "@/components/user-button";
import WorkspaceSwitcher from "@/components/workspace-switcher";
import { APP_NAME } from "@/lib/constants";

export default function DashboardSidebar() {
  const pathname = usePathname();
  const { workspaceSlug } = useParams<{ workspaceSlug?: string }>();

  return (
    <Sidebar>
      {pathname.startsWith("/account/settings") ? (
        <AccountSettingsContent />
      ) : workspaceSlug ? (
        pathname.startsWith(`/${workspaceSlug}/settings`) ? (
          <WorkspaceSettingsContent workspaceSlug={workspaceSlug} />
        ) : (
          <WorkspaceContent workspaceSlug={workspaceSlug} />
        )
      ) : null}
    </Sidebar>
  );
}

function WorkspaceContent({ workspaceSlug }: { workspaceSlug: string }) {
  const pathname = usePathname();

  const items = useMemo(
    (): { title: string; url: string; icon: LucideIcon; exact?: boolean }[] => [
      {
        title: "Snippets",
        url: `/${workspaceSlug}`,
        icon: HomeIcon,
        exact: true,
      },
      {
        title: "Trash",
        url: `/${workspaceSlug}/trash`,
        icon: TrashIcon,
        exact: true,
      },
      {
        title: "Settings",
        url: `/${workspaceSlug}/settings`,
        icon: SettingsIcon,
      },
    ],
    [workspaceSlug],
  );

  return (
    <SidebarContent>
      <SidebarHeader>
        <div className="flex items-center px-2">
          <div className="flex-1">
            <Link href="/" className="font-semibold">
              {APP_NAME}
            </Link>
          </div>
          <UserButton />
        </div>
        <WorkspaceSwitcher />
      </SidebarHeader>
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            {items.map((item) => (
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
    </SidebarContent>
  );
}

function WorkspaceSettingsContent({
  workspaceSlug,
}: {
  workspaceSlug: string;
}) {
  const pathname = usePathname();

  const items = useMemo(
    (): { title: string; url: string; icon: LucideIcon; exact?: boolean }[] => [
      {
        title: "General",
        url: `/${workspaceSlug}/settings`,
        icon: SettingsIcon,
        exact: true,
      },
    ],
    [workspaceSlug],
  );

  return (
    <SidebarContent>
      <SidebarHeader>
        <div className="flex items-center px-2">
          <div className="flex-1">
            <Link
              href={`/${workspaceSlug}`}
              className="flex items-center font-semibold"
            >
              <ChevronLeftIcon className="mr-2 h-4 w-4" />
              Settings
            </Link>
          </div>
          <UserButton />
        </div>
      </SidebarHeader>
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            {items.map((item) => (
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
    </SidebarContent>
  );
}
function AccountSettingsContent() {
  const pathname = usePathname();

  const items = useMemo(
    (): { title: string; url: string; icon: LucideIcon; exact?: boolean }[] => [
      {
        title: "General",
        url: `/account/settings`,
        icon: SettingsIcon,
        exact: true,
      },
    ],
    [],
  );

  return (
    <SidebarContent>
      <SidebarHeader>
        <div className="flex items-center px-2">
          <div className="flex-1">
            <Link href="/" className="flex items-center font-semibold">
              <ChevronLeftIcon className="mr-2 h-4 w-4" />
              Account
            </Link>
          </div>
          <UserButton />
        </div>
      </SidebarHeader>
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            {items.map((item) => (
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
    </SidebarContent>
  );
}

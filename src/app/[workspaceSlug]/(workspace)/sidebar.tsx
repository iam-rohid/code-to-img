"use client";

import { useMemo } from "react";
import { HomeIcon, SettingsIcon, TrashIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
import { useWorkspace } from "@/providers/workspace-provider";

export default function WorkspaceSidebar() {
  const pathname = usePathname();
  const { workspace } = useWorkspace();

  const items = useMemo(
    () => [
      {
        title: "Snippets",
        url: `/${workspace.slug}`,
        icon: HomeIcon,
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
    [workspace.slug],
  );

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarHeader>
          <div className="flex items-center px-2">
            <div className="flex-1">
              <Link href="/app" className="font-semibold">
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
    </Sidebar>
  );
}

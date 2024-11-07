"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import UserButton from "@/components/user-button";
import { useWorkspace } from "@/providers/workspace-provider";
import { ChevronLeftIcon, SettingsIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

export default function SettingsSidebar() {
  const pathname = usePathname();
  const { workspace } = useWorkspace();

  const items = useMemo(
    () => [
      {
        title: "General",
        url: `/${workspace.slug}/settings`,
        icon: SettingsIcon,
        exact: true,
      },
    ],
    [workspace.slug],
  );

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarHeader>
          <div className="flex items-center justify-between gap-2 px-2">
            <Link
              href={`/${workspace.slug}`}
              className="group/back flex items-center overflow-hidden text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
            >
              <ChevronLeftIcon className="mr-2 h-5 w-5 flex-shrink-0 transition-transform duration-200 group-hover/back:-translate-x-1" />
              <p className="truncate">Settings</p>
            </Link>

            <UserButton />
          </div>
        </SidebarHeader>

        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
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

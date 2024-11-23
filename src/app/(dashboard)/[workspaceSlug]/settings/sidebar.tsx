"use client";

import { useMemo } from "react";
import { ChevronLeftIcon, LucideIcon, SettingsIcon } from "lucide-react";
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

export default function WorkspcaeSettingsSidebar() {
  const pathname = usePathname();
  const { workspaceSlug } = useParams<{ workspaceSlug: string }>();

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
    <Sidebar>
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
    </Sidebar>
  );
}

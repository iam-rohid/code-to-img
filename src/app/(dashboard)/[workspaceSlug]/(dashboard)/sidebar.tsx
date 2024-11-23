"use client";

import { useMemo } from "react";
import { HomeIcon, LucideIcon, SettingsIcon, TrashIcon } from "lucide-react";
import Image from "next/image";
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

export default function WorkspcaeSidebar() {
  const pathname = usePathname();
  const { workspaceSlug } = useParams<{ workspaceSlug: string }>();

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
    <Sidebar>
      <SidebarContent>
        <SidebarHeader>
          <div className="flex items-center px-2">
            <div className="flex-1">
              <Link
                href={`/${workspaceSlug}`}
                className="flex h-10 w-10 items-center justify-center"
              >
                <Image
                  src="/code-to-img.svg"
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

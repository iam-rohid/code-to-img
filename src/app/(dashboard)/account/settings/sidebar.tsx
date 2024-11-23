"use client";

import { useMemo } from "react";
import { ChevronLeftIcon, LucideIcon, SettingsIcon } from "lucide-react";
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

export default function AccountSidebar() {
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
    <Sidebar>
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
    </Sidebar>
  );
}

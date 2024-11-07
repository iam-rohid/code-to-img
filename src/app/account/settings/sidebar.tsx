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
import { ChevronLeftIcon, SettingsIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

export default function SettingsSidebar() {
  const pathname = usePathname();

  const items = useMemo(
    () => [
      {
        title: "General",
        url: "/account/settings",
        icon: SettingsIcon,
        exact: true,
      },
    ],
    []
  );

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarHeader>
          <div className="flex items-center justify-between px-2 gap-2">
            <Link
              href="/dashboard"
              className="font-semibold flex items-center text-sm group/back text-muted-foreground hover:text-foreground transition-colors overflow-hidden"
            >
              <ChevronLeftIcon className="w-5 h-5 mr-2 group-hover/back:-translate-x-1 transition-transform duration-200 flex-shrink-0" />
              <p className="truncate">Account</p>
            </Link>

            <UserButton />
          </div>
        </SidebarHeader>
        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
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

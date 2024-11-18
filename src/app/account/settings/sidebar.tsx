"use client";

import { useMemo } from "react";
import { ChevronLeftIcon, SettingsIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
    [],
  );

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarHeader>
          <div className="flex items-center justify-between gap-2 px-2">
            <Link
              href="/"
              className="group/back flex items-center overflow-hidden text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
            >
              <ChevronLeftIcon className="mr-2 h-5 w-5 flex-shrink-0 transition-transform duration-200 group-hover/back:-translate-x-1" />
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

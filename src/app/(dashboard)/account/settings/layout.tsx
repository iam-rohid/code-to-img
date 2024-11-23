"use client";

import { ReactNode } from "react";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import AccountSidebar from "./sidebar";

export default function AccountLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <AccountSidebar />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}

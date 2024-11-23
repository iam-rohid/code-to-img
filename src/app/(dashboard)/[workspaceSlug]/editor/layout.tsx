import { ReactNode } from "react";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import EditorSidebar from "./sidebar";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <EditorSidebar />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}

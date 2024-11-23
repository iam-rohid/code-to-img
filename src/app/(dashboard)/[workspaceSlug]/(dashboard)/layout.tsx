import { ReactNode } from "react";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import WorkspcaeSidebar from "./sidebar";

export default function WorkspaceLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <WorkspcaeSidebar />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}

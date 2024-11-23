import { ReactNode } from "react";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import WorkspcaeSettingsSidebar from "./sidebar";

export default function WorkspaceLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <WorkspcaeSettingsSidebar />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}

import { ReactNode } from "react";

import DashboardSidebar from "@/components/layout/dashboard-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export const dynamic = "force-static";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}

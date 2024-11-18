import { Loader2 } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarInset,
  SidebarProvider,
} from "../ui/sidebar";

export default function DashboardLoader() {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarContent></SidebarContent>
      </Sidebar>
      <SidebarInset className="flex">
        <div className="flex flex-1 items-center justify-center">
          <Loader2 className="animate-spin" />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

import { ReactNode } from "react";

import WorkspaceProvider from "@/providers/workspace-provider";
import DndProvider from "./dnd-provider";

export const dynamic = "force-static";

export default function WorkspaceLayout({ children }: { children: ReactNode }) {
  return (
    <DndProvider>
      <WorkspaceProvider>{children}</WorkspaceProvider>
    </DndProvider>
  );
}

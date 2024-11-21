import { ReactNode } from "react";

import WorkspaceProvider from "@/providers/workspace-provider";

export default function WorkspaceLayout({ children }: { children: ReactNode }) {
  return <WorkspaceProvider>{children}</WorkspaceProvider>;
}

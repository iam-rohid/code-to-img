import { ReactNode } from "react";

import WorkspaceProvider from "@/providers/workspace-provider";

export const dynamic = "force-static";

export default function WorkspaceLayout({ children }: { children: ReactNode }) {
  return <WorkspaceProvider>{children}</WorkspaceProvider>;
}

import { type ReactNode } from "react";

import WorkspaceProvider from "@/providers/workspace-provider";

export default async function Layout({ children }: { children: ReactNode }) {
  return <WorkspaceProvider>{children}</WorkspaceProvider>;
}

"use client";

import { createContext, ReactNode, useContext, useEffect } from "react";
import { useParams } from "next/navigation";

import { Workspace, WorkspaceMember } from "@/db/schema";
import { setWorkspaceSlugInCookie } from "@/lib/server/actions";
import { trpc } from "@/trpc/client";

export type AuthContextValue = {
  workspace: Workspace;
  workspaceMember: WorkspaceMember;
};

const Context = createContext<AuthContextValue | null>(null);

export default function WorkspaceProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { workspaceSlug } = useParams<{ workspaceSlug: string }>();
  const [workspace] = trpc.workspaces.getWorkspaceBySlug.useSuspenseQuery({
    slug: workspaceSlug,
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      void setWorkspaceSlugInCookie(workspaceSlug);
    }, 100);
    return () => {
      clearTimeout(timeout);
    };
  }, [workspaceSlug]);

  return (
    <Context.Provider
      value={{
        workspace: workspace.workspace,
        workspaceMember: workspace.workspaceMember,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export const useWorkspace = () => {
  const context = useContext(Context);
  if (!context) {
    throw new Error("useWorkspace must use inside WorkspaceProvider");
  }
  return context;
};

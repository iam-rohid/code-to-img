"use client";

import { createContext, ReactNode, useContext, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { notFound, useParams } from "next/navigation";

import { Workspace, WorkspaceMember } from "@/db/schema";
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
  const workspaceQuery = trpc.workspaces.getWorkspaceBySlug.useQuery(
    { slug: workspaceSlug },
    { retry: false },
  );
  const { mutate: setCurrentWorkspaceSlug } =
    trpc.workspaces.setCurrentWorkspaceSlug.useMutation();

  useEffect(() => {
    if (!workspaceQuery.isSuccess) {
      return;
    }
    const timeout = setTimeout(() => {
      setCurrentWorkspaceSlug(workspaceQuery.data.workspace.slug);
    }, 100);
    return () => {
      clearTimeout(timeout);
    };
  }, [
    setCurrentWorkspaceSlug,
    workspaceQuery.data?.workspace.slug,
    workspaceQuery.isSuccess,
  ]);

  if (workspaceQuery.isPending) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (workspaceQuery.isError) {
    if (workspaceQuery.error.data?.code === "NOT_FOUND") {
      notFound();
    }
    return <p>{workspaceQuery.error.message}</p>;
  }

  return (
    <Context.Provider
      value={{
        workspace: workspaceQuery.data.workspace,
        workspaceMember: workspaceQuery.data.workspaceMember,
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

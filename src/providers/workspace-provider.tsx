"use client";

import { createContext, ReactNode, useContext, useEffect } from "react";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

import { Button } from "@/components/ui/button";
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
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="mx-auto my-auto flex max-w-screen-md flex-col items-center gap-4">
          <p className="text-7xl font-bold">404</p>
          <p className="text-muted-foreground">
            Workspace doesn&apos;t exist or you don&apos;t have permission to
            access it.
          </p>

          <Button asChild>
            <Link href="/">Go back home</Link>
          </Button>
        </div>
      </div>
    );
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

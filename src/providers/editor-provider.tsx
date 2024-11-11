"use client";

import { createContext, type ReactNode,useContext } from "react";
import { useParams } from "next/navigation";

import type { Snippet } from "@/db/schema";
import { trpc } from "@/trpc/client";

import { useWorkspace } from "./workspace-provider";

export interface EditorContext {
  snippet: Snippet;
}

const Context = createContext<EditorContext | null>(null);

export interface EditorProviderProps {
  children: ReactNode;
}

export default function EditorProvider({ children }: EditorProviderProps) {
  const { snippetId } = useParams<{ snippetId: string }>();
  const { workspace } = useWorkspace();
  const snippetQuery = trpc.snippets.getSnippet.useQuery({ snippetId });

  if (snippetQuery.isPending) {
    return <p>Loading...</p>;
  }

  if (snippetQuery.isError) {
    return <p>{snippetQuery.error.message}</p>;
  }

  if (workspace.id !== snippetQuery.data.workspaceId) {
    return <p>Not Found!</p>;
  }

  return (
    <Context.Provider value={{ snippet: snippetQuery.data }}>
      {children}
    </Context.Provider>
  );
}

export function useEditor() {
  const context = useContext(Context);
  if (!context) {
    throw new Error("useEditor must use inside EditorProvider");
  }
  return context;
}

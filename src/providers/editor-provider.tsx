"use client";

import type { Snippet } from "@/db/schema";
import { trpc } from "@/trpc/client";
import { useParams } from "next/navigation";
import { createContext, useContext, type ReactNode } from "react";

export interface EditorContext {
  snippet: Snippet;
}

const Context = createContext<EditorContext | null>(null);

export interface EditorProviderProps {
  children: ReactNode;
}

export default function EditorProvider({ children }: EditorProviderProps) {
  const { snippetId } = useParams<{ snippetId: string }>();
  const snippetQuery = trpc.snippets.getSnippet.useQuery({ snippetId });

  if (snippetQuery.isPending) {
    return <p>Loading...</p>;
  }

  if (snippetQuery.isError) {
    return <p>{snippetQuery.error.message}</p>;
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

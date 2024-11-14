"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import { getDefaultSnippetData } from "@/lib/utils/editor";
import { iSnippetData, snippetSchema } from "@/lib/validator/snippet";
import { trpc } from "@/trpc/client";

import { useWorkspace } from "./workspace-provider";

export interface EditorContext {
  isSaving: boolean;
  isDurty: boolean;
  snippetData: iSnippetData;
  updateSnippetData: (snippet: iSnippetData) => void;
}

const Context = createContext<EditorContext | null>(null);

export interface CloudEditorProviderProps {
  children: ReactNode;
  snippetId: string;
}

export function CloudEditorProvider({
  children,
  snippetId,
}: CloudEditorProviderProps) {
  const { workspace } = useWorkspace();
  const [newData, setNewData] = useState<iSnippetData | null>(null);
  const snippetQuery = trpc.snippets.getSnippet.useQuery({ snippetId });
  const { mutate, isPending } = trpc.snippets.updateSnippet.useMutation();

  useEffect(() => {
    if (!isPending && newData) {
      mutate({ snippetId, dto: { data: newData } });
      setNewData(null);
    }
  }, [isPending, mutate, newData, snippetId]);

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
    <Context.Provider
      value={{
        snippetData: snippetQuery.data.data,
        updateSnippetData: setNewData,
        isDurty: !!newData,
        isSaving: isPending,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export interface LocalEditorProviderProps {
  children: ReactNode;
}

export function LocalEditorProvider({ children }: LocalEditorProviderProps) {
  const [snippetData, setSnippetData] = useState<iSnippetData | null>(null);
  const [newData, setNewData] = useState<iSnippetData | null>(null);

  useEffect(() => {
    if (newData) {
      localStorage.setItem("snippet-data", JSON.stringify(newData));
      setNewData(null);
    }
  }, [newData]);

  useEffect(() => {
    const json = localStorage.getItem("snippet-data");
    let initialized = false;
    if (json) {
      try {
        const data = snippetSchema.parse(JSON.parse(json));
        setSnippetData(data);
        initialized = true;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {}
    }

    if (!initialized) {
      setSnippetData(getDefaultSnippetData());
    }
  }, []);

  if (!snippetData) {
    return <p>Loading...</p>;
  }

  return (
    <Context.Provider
      value={{
        snippetData,
        updateSnippetData: setNewData,
        isDurty: !!newData,
        isSaving: false,
      }}
    >
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

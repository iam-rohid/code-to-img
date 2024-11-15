"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import { Snippet } from "@/db/schema";
import { getDefaultSnippetData } from "@/lib/utils/editor";
import { iSnippetData, snippetSchema } from "@/lib/validator/snippet";
import { trpc } from "@/trpc/client";

export interface EditorContext {
  isSaving: boolean;
  isDurty: boolean;
  snippetData: iSnippetData;
  updateSnippetData: (snippet: iSnippetData) => void;
}

const Context = createContext<EditorContext | null>(null);

export interface CloudEditorProviderProps {
  children: ReactNode;
  snippet: Snippet;
}

export function CloudEditorProvider({
  children,
  snippet,
}: CloudEditorProviderProps) {
  const [newData, setNewData] = useState<iSnippetData | null>(null);
  const { mutate, isPending } = trpc.snippets.updateSnippet.useMutation();

  useEffect(() => {
    if (!isPending && newData) {
      mutate({ snippetId: snippet.id, dto: { data: newData } });
      setNewData(null);
    }
  }, [isPending, mutate, newData, snippet.id]);

  return (
    <Context.Provider
      value={{
        snippetData: snippet.data,
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

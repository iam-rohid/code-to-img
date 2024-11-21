"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { toast } from "sonner";

import { Snippet } from "@/db/schema";
import { DEFAULT_SNIPPET_TEMPLATE } from "@/lib/constants/templates";
import { iSnippetData, snippetSchema } from "@/lib/validator/snippet";
import { trpc } from "@/trpc/client";

export interface SnippetDataContext {
  isSaving: boolean;
  isDurty: boolean;
  snippetData: iSnippetData;
  updateSnippetData: (snippet: iSnippetData) => void;
}

const Context = createContext<SnippetDataContext | null>(null);

export interface CloudSnippetDataProviderProps {
  children: ReactNode;
  snippet: Snippet;
}

export function CloudSnippetDataProvider({
  children,
  snippet,
}: CloudSnippetDataProviderProps) {
  const [newData, setNewData] = useState<iSnippetData | null>(null);
  const utils = trpc.useUtils();
  const { mutate, isPending } = trpc.snippets.updateSnippet.useMutation({
    onMutate: (vars) => {
      utils.snippets.getSnippet.setData(
        { snippetId: vars.snippetId },
        (snippet) =>
          snippet
            ? {
                ...snippet,
                data: vars.dto.data ?? snippet.data,
                title: vars.dto.title ?? snippet.title,
              }
            : undefined,
      );
    },
    onSuccess: (data) => {
      utils.snippets.getSnippet.setData({ snippetId: snippet.id }, data);
    },
    onError: (error) => {
      toast.error("Failed to save", { description: error.message });
    },
  });

  useEffect(() => {
    if (isPending || !newData) {
      return;
    }

    const timeout = setTimeout(() => {
      mutate({ snippetId: snippet.id, dto: { data: newData } });
      setNewData(null);
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
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

export interface LocalSnippetDataProviderProps {
  children: ReactNode;
}

export function LocalSnippetDataProvider({
  children,
}: LocalSnippetDataProviderProps) {
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
      setSnippetData(DEFAULT_SNIPPET_TEMPLATE.data);
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

export function useSnippetData() {
  const context = useContext(Context);
  if (!context) {
    throw new Error("useEditor must use inside EditorProvider");
  }
  return context;
}

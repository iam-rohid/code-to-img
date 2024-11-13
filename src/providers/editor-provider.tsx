"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { nanoid } from "nanoid";
import { toast } from "sonner";

import { getDefaultSnippetData } from "@/lib/utils/editor";
import { iSnippetData, snippetSchema } from "@/lib/validator/snippet";
import { trpc } from "@/trpc/client";

import { useWorkspace } from "./workspace-provider";

export interface EditorContext {
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
  const snippetQuery = trpc.snippets.getSnippet.useQuery({ snippetId });

  const updateSnippetMut = trpc.snippets.updateSnippet.useMutation({
    onMutate: () => {
      const tid = nanoid();
      toast.loading("Saving...", { id: tid });
      return {
        tid,
      };
    },
    onSuccess(_, _vars, ctx) {
      toast.dismiss(ctx.tid);
      toast.success("Saved");
    },
    onError(error, _vars, ctx) {
      if (ctx?.tid) {
        toast.dismiss(ctx.tid);
      }
      toast.error("Failed to save", {
        description: error.message,
      });
    },
  });

  const updateSnippetData = useCallback(
    (data: iSnippetData) => {
      updateSnippetMut.mutate({
        snippetId: snippetId,
        dto: { data },
      });
    },
    [snippetId, updateSnippetMut],
  );

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
      value={{ snippetData: snippetQuery.data.data, updateSnippetData }}
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

  const updateSnippetData = useCallback((data: iSnippetData) => {
    localStorage.setItem("snippet-data", JSON.stringify(data));
    toast.success("Saved");
  }, []);

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
    <Context.Provider value={{ snippetData, updateSnippetData }}>
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

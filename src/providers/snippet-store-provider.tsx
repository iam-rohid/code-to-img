"use client";

import { createContext, ReactNode, useContext, useRef } from "react";
import { useStore } from "zustand";

import { iSnippetData } from "@/lib/validator/snippet";
import {
  createSnippetStore,
  SnippetState,
  SnippetStore,
} from "@/store/snippet-store";

export const SnippetStoreContext = createContext<SnippetStore | null>(null);

export const SnippetStoreProvider = ({
  children,
  snippet,
}: {
  children: ReactNode;
  snippet?: Partial<iSnippetData>;
}) => {
  const storeRef = useRef<SnippetStore>();

  if (!storeRef.current) {
    if (!snippet) {
      const snippetString = localStorage.getItem("snippet-data");
      if (snippetString) {
        snippet = JSON.parse(snippetString);
      }
    }
    storeRef.current = createSnippetStore(snippet);
  }

  return (
    <SnippetStoreContext.Provider value={storeRef.current}>
      {children}
    </SnippetStoreContext.Provider>
  );
};

export function useSnippetStore<T>(selector: (state: SnippetState) => T): T {
  const store = useContext(SnippetStoreContext);
  if (!store) throw new Error("Missing SnippetContext.Provider in the tree");
  return useStore(store, selector);
}

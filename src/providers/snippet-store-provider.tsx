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
  snippet: iSnippetData;
}) => {
  const storeRef = useRef<SnippetStore>();

  if (!storeRef.current) {
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

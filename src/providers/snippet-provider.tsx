"use client";

import { createContext, ReactNode, useContext, useRef } from "react";
import { useStore } from "zustand";

import { iSnippetData } from "@/lib/validator/snippet";
import {
  createSnippetStore,
  SnippetState,
  SnippetStore,
} from "@/store/snippet-store";

export const SnippetContext = createContext<SnippetStore | null>(null);

export const SnippetProvider = ({
  children,
  snippet,
}: {
  children: ReactNode;
  snippet?: Partial<iSnippetData>;
}) => {
  const storeRef = useRef<SnippetStore>();

  if (!storeRef.current) {
    storeRef.current = createSnippetStore(snippet);
  }

  return (
    <SnippetContext.Provider value={storeRef.current}>
      {children}
    </SnippetContext.Provider>
  );
};

export function useSnippetStore<T>(selector: (state: SnippetState) => T): T {
  const store = useContext(SnippetContext);
  if (!store) throw new Error("Missing SnippetContext.Provider in the tree");
  return useStore(store, selector);
}

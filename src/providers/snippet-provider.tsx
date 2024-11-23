import { createContext, ReactNode, useContext } from "react";

import { Snippet } from "@/db/schema";

export const SnippetContext = createContext<Snippet | null>(null);

export default function SnippetProvider({
  children,
  snippet,
}: {
  children: ReactNode;
  snippet: Snippet;
}) {
  return (
    <SnippetContext.Provider value={snippet}>
      {children}
    </SnippetContext.Provider>
  );
}

export const useSnippet = () => {
  return useContext(SnippetContext);
};

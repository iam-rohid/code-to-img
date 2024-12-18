"use client";

import AppBar from "@/components/app-bar";
import FoldersAndSnippetsList from "@/components/folders-and-snippets-list";

export default function PageClient() {
  return (
    <>
      <AppBar title="Snippets" />
      <FoldersAndSnippetsList />
    </>
  );
}

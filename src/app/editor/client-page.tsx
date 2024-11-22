"use client";

import { useEffect, useState } from "react";

import SnippetEditor from "@/components/snippet-editor/editor";
import { DEFAULT_SNIPPET_TEMPLATE } from "@/lib/constants/templates";
import { iSnippetData, snippetSchema } from "@/lib/validator/snippet";

export default function ClientPage() {
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

  return <SnippetEditor defaultValue={snippetData} onChnage={setNewData} />;
}

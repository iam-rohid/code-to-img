import EditorProvider from "@/providers/editor-provider";

import ClientEditorPage from "./client-page";

export default function Page() {
  return (
    <EditorProvider>
      <ClientEditorPage />
    </EditorProvider>
  );
}

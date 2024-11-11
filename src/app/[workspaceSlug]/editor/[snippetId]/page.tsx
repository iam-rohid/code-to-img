import Editor from "@/components/editor/editor";
import EditorProvider from "@/providers/editor-provider";

export default function Page() {
  return (
    <EditorProvider>
      <Editor />
    </EditorProvider>
  );
}

import Editor from "@/components/editor/editor";
import { LocalEditorProvider } from "@/providers/editor-provider";

export default function Page() {
  return (
    <LocalEditorProvider>
      <Editor />
    </LocalEditorProvider>
  );
}

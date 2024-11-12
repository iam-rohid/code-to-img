"use client";

import { Loader2 } from "lucide-react";
import dynamic from "next/dynamic";

const Editor = dynamic(() => import("@/components/editor/editor"), {
  ssr: false,
  loading: () => (
    <div className="flex flex-1 items-center justify-center">
      <Loader2 className="animate-spin" />
    </div>
  ),
});

export default function ClientEditorPage() {
  return <Editor />;
}

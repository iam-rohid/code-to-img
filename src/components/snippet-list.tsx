import { Snippet } from "@/db/schema";

import { SnippetCard } from "./snippet-card";
import { Skeleton } from "./ui/skeleton";

export function SnippetList({ snippets }: { snippets: Snippet[] }) {
  return (
    <div className="@container">
      <div className="@[36rem]:grid-cols-2 @[56rem]:grid-cols-3 grid grid-cols-1 gap-6">
        {snippets.map((snippet) => (
          <SnippetCard snippet={snippet} key={snippet.id} />
        ))}
      </div>
    </div>
  );
}

export function SnippetListSkeleton({ count = 10 }: { count?: number }) {
  return (
    <div className="@container">
      <div className="@[36rem]:grid-cols-2 @[56rem]:grid-cols-3 grid grid-cols-1 gap-6">
        {Array.from({ length: count }).map((_, i) => (
          <Skeleton key={i} className="aspect-[3/2.5] rounded-lg" />
        ))}
      </div>
    </div>
  );
}

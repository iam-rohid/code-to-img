import { Folder } from "@/db/schema";

import FolderCard from "./folder-card";
import { Skeleton } from "./ui/skeleton";

export function FolderList({ folders }: { folders: Folder[] }) {
  return (
    <div className="@container">
      <div className="grid grid-cols-1 gap-6 @[36rem]:grid-cols-2 @[56rem]:grid-cols-3">
        {folders.map((folder) => (
          <FolderCard folder={folder} key={folder.id} />
        ))}
      </div>
    </div>
  );
}

export function FolderListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="@container">
      <div className="grid grid-cols-1 gap-6 @[36rem]:grid-cols-2 @[56rem]:grid-cols-3">
        {Array.from({ length: count }).map((_, i) => (
          <Skeleton key={i} className="h-14 rounded-lg" />
        ))}
      </div>
    </div>
  );
}

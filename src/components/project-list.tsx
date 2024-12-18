import { Project } from "@/db/schema";

import ProjectCard from "./project-card";
import { Skeleton } from "./ui/skeleton";

export function ProjectList({ projects }: { projects: Project[] }) {
  return (
    <div className="@container">
      <div className="grid grid-cols-1 gap-6 @[36rem]:grid-cols-2 @[56rem]:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard project={project} key={project.id} />
        ))}
      </div>
    </div>
  );
}

export function ProjectListSkeleton({ count = 6 }: { count?: number }) {
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

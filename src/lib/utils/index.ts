import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getCenterXYForElement(args: {
  width: number;
  height: number;
  canvasWidth: number;
  canvasHeight: number;
}): { x: number; y: number } {
  return {
    x: args.canvasWidth / 2 - args.width / 2,
    y: args.canvasHeight / 2 - args.height / 2,
  };
}

export const getSnippetUrl = (
  snippet: { id: string; projectId?: string | null },
  workspaceSlug: string,
) => {
  let url = `/${workspaceSlug}/editor/${snippet.id}`;
  const searchParams = new URLSearchParams();
  if (snippet.projectId) {
    searchParams.set("projectId", snippet.projectId);
  }
  if (searchParams.toString()) {
    url += "?" + searchParams.toString();
  }
  return url;
};

export const getProjectUrl = (
  project: { id: string },
  workspaceSlug: string,
) => {
  const url = `/${workspaceSlug}/projects/${project.id}`;
  return url;
};

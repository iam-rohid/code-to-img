import AppBar from "@/components/app-bar";

import { WorkspaceIdCard, WorkspaceNameCard, WorkspaceSlugCard } from "./cards";

export default async function Page({
  params,
}: {
  params: Promise<{ workspaceSlug: string }>;
}) {
  const { workspaceSlug } = await params;
  return (
    <>
      <AppBar
        links={[{ title: "Settings", url: `/${workspaceSlug}/settings` }]}
        title="General"
      />
      <div className="container mx-auto max-w-screen-md px-4 md:px-8 my-16 space-y-8">
        <WorkspaceIdCard />
        <WorkspaceNameCard />
        <WorkspaceSlugCard />
      </div>
    </>
  );
}

import { redirect, RedirectType } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ workspaceSlug: string }>;
}) {
  const { workspaceSlug } = await params;
  redirect(`/${workspaceSlug}/recents`, RedirectType.replace);
}

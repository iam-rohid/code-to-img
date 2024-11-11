import Link from "next/link";
import { redirect, RedirectType } from "next/navigation";

import { getCurrentSession } from "@/auth/utils";

export default async function Page() {
  const session = await getCurrentSession();
  if (session) {
    redirect("/dashboard", RedirectType.replace);
  }

  return (
    <div>
      <Link href="/login">Log In</Link>
    </div>
  );
}

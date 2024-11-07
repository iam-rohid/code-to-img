"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LogInForm() {
  return (
    <div>
      <Button asChild>
        <Link href="/login/google">Log in with Google</Link>
      </Button>
      <Button asChild>
        <Link href="/login/github">Log in with Github</Link>
      </Button>
    </div>
  );
}

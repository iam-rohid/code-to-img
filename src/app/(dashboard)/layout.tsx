"use client";

import FullScreenLoader from "@/components/full-screen-loader";
import { useAuth } from "@/providers/auth-provider";
import { notFound } from "next/navigation";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  const { status } = useAuth();

  if (status === "loading") {
    return <FullScreenLoader />;
  }

  if (status === "unauthorized") {
    notFound();
  }

  return children;
}

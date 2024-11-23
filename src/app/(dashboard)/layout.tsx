"use client";

import { ReactNode } from "react";
import { notFound } from "next/navigation";

import FullScreenLoader from "@/components/full-screen-loader";
import { useAuth } from "@/providers/auth-provider";

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

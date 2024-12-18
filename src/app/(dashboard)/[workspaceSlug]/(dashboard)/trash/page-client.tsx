"use client";

import AppBar from "@/components/app-bar";

import TrashList from "./trash-list";

export default function PageClient() {
  return (
    <>
      <AppBar title="Trash" />
      <TrashList />
    </>
  );
}

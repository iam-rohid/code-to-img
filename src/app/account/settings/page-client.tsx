"use client";

import AppBar from "@/components/app-bar";

export default function PageClient() {
  return (
    <>
      <AppBar
        links={[{ title: "Account", url: "/account/settings" }]}
        title="General"
      />
    </>
  );
}

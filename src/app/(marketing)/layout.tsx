import { ReactNode } from "react";

import NavBar from "./nav-bar";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <NavBar />
      <div className="flex-1">{children}</div>
    </>
  );
}

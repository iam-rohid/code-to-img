import React, { Fragment, ReactNode } from "react";
import Link from "next/link";

import {
  Breadcrumb,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import { SidebarTrigger } from "./ui/sidebar";

export default function AppBar({
  title,
  links,
  leading,
  trailing,
}: {
  title: string;
  links?: { title: string; url: string }[];
  leading?: ReactNode;
  trailing?: ReactNode;
}) {
  return (
    <div className="sticky top-0 z-30 flex h-14 items-center border-b bg-background px-4">
      <SidebarTrigger />
      <p className="mx-4 h-8 w-px bg-border" />
      <Breadcrumb>
        <BreadcrumbList>
          {links?.map((link) => (
            <Fragment key={link.title}>
              <BreadcrumbLink asChild>
                <Link href={link.url}>{link.title}</Link>
              </BreadcrumbLink>
              <BreadcrumbSeparator />
            </Fragment>
          ))}
          <BreadcrumbPage>{title}</BreadcrumbPage>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="ml-4 flex flex-1 justify-between">
        {leading ?? <div />}
        {trailing}
      </div>
    </div>
  );
}

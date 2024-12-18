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
  trailing,
}: {
  title: string;
  links?: { title: string; url: string }[];
  trailing?: ReactNode;
}) {
  return (
    <div className="sticky top-0 z-30 flex h-14 items-center border-b bg-background px-4">
      <SidebarTrigger />
      <p className="mx-4 h-8 w-px bg-border" />
      <Breadcrumb className="flex-1">
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
      {trailing}
    </div>
  );
}

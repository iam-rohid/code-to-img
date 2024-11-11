import React, { Fragment } from "react";
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
}: {
  title: string;
  links?: { title: string; url: string }[];
}) {
  return (
    <div className="flex px-4 items-center h-14">
      <SidebarTrigger />
      <p className="h-8 w-px mx-4 bg-border" />
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
    </div>
  );
}

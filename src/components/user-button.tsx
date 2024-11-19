"use client";

import { LogOutIcon, PlusIcon, UserIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useAuth } from "@/providers/auth-provider";

import { ThemeSwitcher } from "./theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Skeleton } from "./ui/skeleton";

export default function UserButton() {
  const pathname = usePathname();
  const { status, session, signOut } = useAuth();

  if (status === "loading") {
    return <Skeleton className="h-10 w-10 rounded-full" />;
  }

  if (status === "unauthorized") {
    return (
      <Button variant="secondary" asChild>
        <Link href="/login">Sign In</Link>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="flex-shrink-0 rounded-full"
        >
          <Avatar className="h-8 w-8">
            <AvatarFallback>
              <UserIcon className="h-4 w-4" />
            </AvatarFallback>
            {session?.user.image && (
              <AvatarImage src={session.user.image} alt="Avatar" />
            )}
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="bottom">
        <div className="p-2">
          <p className="font-semibold">{session?.user.name}</p>
          <p className="text-sm text-muted-foreground">{session?.user.email}</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {pathname !== "/onboarding/workspace" && (
            <>
              <DropdownMenuItem asChild>
                <Link href="/onboarding/workspace">
                  <PlusIcon />
                  New workspace
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator />
            </>
          )}

          <DropdownMenuItem asChild>
            <Link href="/account/settings">
              <UserIcon />
              My Account
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <div className="flex items-center justify-between gap-2 px-2">
            <p className="text-sm font-medium">Theme</p>
            <ThemeSwitcher />
          </div>
          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={signOut}>
            <LogOutIcon />
            Log out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { LogOutIcon, SettingsIcon, UserIcon } from "lucide-react";
import { useAuth } from "@/providers/auth-provider";
import Link from "next/link";

export default function UserButton() {
  const { session, signOut } = useAuth();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full w-8 h-8 flex-shrink-0"
        >
          <Avatar className="w-8 h-8">
            <AvatarFallback>
              <UserIcon className="w-4 h-4" />
            </AvatarFallback>
            {session?.user.image && (
              <AvatarImage src={session.user.image} alt="Avatar" />
            )}
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <div className="p-2">
          <p className="font-semibold">{session?.user.name}</p>
          <p className="text-sm text-muted-foreground">{session?.user.email}</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/account/settings">
              <SettingsIcon />
              Account
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={signOut}>
            <LogOutIcon />
            Log Out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

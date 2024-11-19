"use client";

import { useCallback, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckIcon, CopyIcon, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import AppBar from "@/components/app-bar";
import { useDeleteAccountModal } from "@/components/modals/delete-account-modal";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { APP_NAME } from "@/lib/constants";
import { useAuth } from "@/providers/auth-provider";
import { trpc } from "@/trpc/client";

export default function PageClient() {
  const { status } = useAuth();

  if (status !== "authorized") {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <>
      <AppBar
        links={[{ title: "Account", url: "/account/settings" }]}
        title="General"
      />
      <div className="container mx-auto my-16 max-w-screen-lg space-y-8 px-4 md:px-8">
        <UserNameCard />
        <UserEmailCard />
        <UserIdCard />
        <DeleteAccountCard />
      </div>
    </>
  );
}

const updateUserNameDto = z.object({
  name: z.string().min(1).max(100),
});

export type UpdateUserNameDto = z.infer<typeof updateUserNameDto>;

export function UserNameCard() {
  const { session } = useAuth();

  const form = useForm<UpdateUserNameDto>({
    resolver: zodResolver(updateUserNameDto),
    defaultValues: {
      name: session?.user.name ?? "",
    },
  });

  const utils = trpc.useUtils();
  const updateUserMut = trpc.users.updateUser.useMutation({
    onSuccess: (data) => {
      form.reset({ name: data.name ?? "" });
      void utils.auth.getSession.invalidate();
      toast("User name updated.");
    },
    onError: (error) => {
      form.reset();
      toast("Failed to update name!", { description: error.message });
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Name</CardTitle>
        <CardDescription>
          This will be your display name on {APP_NAME}.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) =>
            updateUserMut.mutate({
              name: data.name,
            }),
          )}
        >
          <CardContent>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button
              disabled={!form.formState.isDirty || updateUserMut.isPending}
            >
              {updateUserMut.isPending && (
                <Loader2 className="-ml-1 mr-2 h-4 w-4 animate-spin" />
              )}
              Save
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

export function UserEmailCard() {
  const { session } = useAuth();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Email</CardTitle>
        <CardDescription>
          This will be the email you use to log in to {APP_NAME} and receive
          notifications.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <fieldset className="relative">
          <Input defaultValue={session?.user.email ?? ""} readOnly />
        </fieldset>
      </CardContent>
    </Card>
  );
}

export function UserIdCard() {
  const { session } = useAuth();

  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    if (copied) {
      return;
    }

    await window.navigator.clipboard.writeText(session?.user.id ?? "");
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  }, [copied, session?.user.id]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your User Id</CardTitle>
        <CardDescription>
          This is your unique account identifier on {APP_NAME}.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <fieldset className="relative">
          <Input defaultValue={session?.user.id ?? ""} readOnly />
          <Button
            size="icon"
            variant="ghost"
            className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2"
            onClick={handleCopy}
          >
            {copied ? (
              <CheckIcon className="h-4 w-4" />
            ) : (
              <CopyIcon className="h-4 w-4" />
            )}
          </Button>
        </fieldset>
      </CardContent>
    </Card>
  );
}

export function DeleteAccountCard() {
  const [Modal, , setOpen] = useDeleteAccountModal();

  return (
    <Card className="border-destructive">
      <CardHeader>
        <CardTitle>Delete Account</CardTitle>
        <CardDescription>
          Permanently delete your {APP_NAME} account, all of your workspaces,
          snippets and their respective stats. This action cannot be undone -
          please proceed with caution.
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Button variant="destructive" onClick={() => setOpen(true)}>
          Delete Account
        </Button>
      </CardFooter>
      <Modal />
    </Card>
  );
}

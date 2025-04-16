"use client";

import Image from "next/image";
import Link from "next/link";

import GithubIcon from "@/components/icons/github-icon";
import GoogleIcon from "@/components/icons/google-icon";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { APP_NAME } from "@/lib/constants";

export default function PageClient() {
  return (
    <div className="flex flex-1 flex-col justify-center">
      <div className="mx-auto w-full max-w-lg px-4 py-16">
        <Card>
          <CardHeader className="pb-12">
            <div className="mb-4 w-fit">
              <Link href="/">
                <Image
                  src="/images/code-to-img.svg"
                  alt="CodeToImg Logo"
                  width={128}
                  height={128}
                  className="h-12 w-12 object-contain"
                />
              </Link>
            </div>
            <CardTitle>Log in to {APP_NAME}</CardTitle>
            <CardDescription></CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <Button asChild variant="secondary">
                <Link href="/login/github">
                  <GithubIcon />
                  Log in with Github
                </Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href="/login/google">
                  <GoogleIcon />
                  Log in with Google
                </Link>
              </Button>
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-center text-sm leading-normal text-muted-foreground">
              By using Polar you agree to our{" "}
              <Link
                href="/terms"
                className="font-medium text-foreground underline-offset-4 hover:underline"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="font-medium text-foreground underline-offset-4 hover:underline"
              >
                Privacy Policy
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

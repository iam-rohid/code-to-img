import Image from "next/image";
import Link from "next/link";

import CreateWorkspaceForm from "@/components/forms/create-workspace-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import UserButton from "@/components/user-button";

export default function Page() {
  return (
    <>
      <div className="fixed left-0 right-0 top-0 flex items-center px-4 py-2">
        <Link href="/" className="flex h-10 w-10 items-center justify-center">
          <Image
            src="/images/code-to-img.svg"
            alt="codetoimg logo"
            width={48}
            height={48}
            className="h-8 w-8"
          />
        </Link>

        <div className="flex flex-1 items-center justify-end">
          <UserButton />
        </div>
      </div>
      <div className="flex flex-1 flex-col justify-center">
        <Card className="container mx-auto my-16 max-w-md">
          <CardHeader>
            <CardTitle>Create Workspace</CardTitle>
          </CardHeader>
          <CardContent>
            <CreateWorkspaceForm />
          </CardContent>
        </Card>
      </div>
    </>
  );
}

import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div className="flex flex-col items-center justify-center gap-8">
        <p className="text-7xl font-bold">404</p>
        <Button asChild>
          <Link href="/">Go back home</Link>
        </Button>
      </div>
    </div>
  );
}

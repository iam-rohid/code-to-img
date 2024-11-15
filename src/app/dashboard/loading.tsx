import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-2">
        <Loader2 className="animate-spin" />
        <p>Redirecting....</p>
      </div>
    </div>
  );
}

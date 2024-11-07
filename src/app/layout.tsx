import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { TRPCProvider } from "@/trpc/client";
import AuthProvider from "@/providers/auth-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getCurrentSession } from "@/auth/utils";

export const metadata: Metadata = {
  title: "Code To Img",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getCurrentSession();

  return (
    <html lang="en">
      <body
        className="flex min-h-screen flex-col antialiased"
        suppressHydrationWarning
      >
        <TooltipProvider>
          <TRPCProvider>
            <AuthProvider session={session}>{children}</AuthProvider>
          </TRPCProvider>
          <Toaster />
        </TooltipProvider>
      </body>
    </html>
  );
}

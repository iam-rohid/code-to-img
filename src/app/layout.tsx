import "./globals.css";

import type { Metadata } from "next";

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import AuthProvider from "@/providers/auth-provider";
import { TRPCProvider } from "@/trpc/client";

export const metadata: Metadata = {
  title: "Code To Img",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="flex min-h-screen flex-col antialiased"
        suppressHydrationWarning
      >
        <TooltipProvider>
          <TRPCProvider>
            <AuthProvider>{children}</AuthProvider>
          </TRPCProvider>
          <Toaster />
        </TooltipProvider>
      </body>
    </html>
  );
}

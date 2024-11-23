import "./globals.css";

import type { Metadata } from "next";

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import AuthProvider from "@/providers/auth-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { TRPCProvider } from "@/trpc/client";

const title = "CodeToImg | Create and Share Stunning Images of your Code";
const description =
  "CodeToImg is a beautifully designed application that helps you generate beautiful and customizable images of your code snippets. This is built for the developer by the developer. If you want to share your code with anyone or on any social media this is the application you need.";

export const metadata: Metadata = {
  title,
  description,
  keywords:
    "codetoimg, codeimg, image, code, developer, developer tool, image generator, code snippets, snippets, code to image, converter, image converter, convert code to images, code to img, code image, snapshot, code snapshot, codeblock",
  twitter: {
    card: "summary_large_image",
    creator: "@codetoimg",
    description,
    title,
    images: `/images/og-image.png`,
  },
  openGraph: {
    title,
    description,
    type: "website",
    images: `/images/og-image.png`,
  },
  robots: "index, follow",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className="flex min-h-screen flex-col antialiased"
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>
            <TRPCProvider>
              <AuthProvider>{children}</AuthProvider>
            </TRPCProvider>
            <Toaster />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

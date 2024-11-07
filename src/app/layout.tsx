import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Code To Img",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col antialiased">{children}</body>
    </html>
  );
}

import type { Metadata } from "next";
import { GTProvider } from "gt-next";
import { ThemeProvider } from "next-themes";
import TRPCProvider from "@/components/TRPCProvider";
import { Toaster } from "@/components/ui/sonner";

import "./globals.css";

export const metadata: Metadata = {
  title: "Multi Wordle",
  description: "A Multilingual Wordle game",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <GTProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <TRPCProvider>{children}</TRPCProvider>
            <Toaster position="top-center" />
          </ThemeProvider>
        </GTProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import TRPCProvider from "@/components/TRPCProvider";

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
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <TRPCProvider>{children}</TRPCProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

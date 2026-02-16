import type { Metadata } from "next";
import { GTProvider } from "gt-next";
import { getLocale } from "gt-next/server";
import { ThemeProvider } from "next-themes";
import TRPCProvider from "@/components/TRPCProvider";
import { Toaster } from "@/components/ui/sonner";

import "./globals.css";

export const metadata: Metadata = {
  title: "Multi Wordle",
  description: "A Multilingual Wordle game",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const dir = locale === "he" ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
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

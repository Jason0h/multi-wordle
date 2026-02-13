import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import TRPCProvider from "@/components/TRPCProvider";
import ThemeToggle from "@/components/ThemeToggle";
import "./globals.css";

export const metadata: Metadata = {
  title: "Multi Wordle",
  description: "A multiplayer Wordle game",
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
          <div className="fixed right-4 top-4 z-50">
            <ThemeToggle />
          </div>
          <TRPCProvider>{children}</TRPCProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

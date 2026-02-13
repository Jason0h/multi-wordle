import type { Metadata } from "next";
import TRPCProvider from "@/components/TRPCProvider";
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
    <html lang="en">
      <body className="antialiased">
        <TRPCProvider>{children}</TRPCProvider>
      </body>
    </html>
  );
}

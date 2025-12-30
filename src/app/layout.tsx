import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "standarflow - Connect Founders with Investors",
  description: "A modern platform connecting innovative founders with strategic investors. Apply with your pitch deck and find the perfect match.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

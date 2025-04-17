import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Al-Hikmah Academy",
  description: "Coding Academy",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}

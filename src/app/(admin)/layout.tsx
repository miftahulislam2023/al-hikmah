import type { Metadata } from "next";
import "@/app/globals.css";
import AdminNavbar from "@/components/admin/AdminNavbar";

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
        <AdminNavbar />

        {/* Main Content - Added padding top to account for fixed navbar */}
        <main className="pt-20">
          {children}
        </main>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import "@/app/globals.css";

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
        {/* Topbar Navigation */}
        <header className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">Al-Hikmah Admin</h1>
          <nav className="space-x-6">
            <Link href="/admin" className="hover:text-yellow-400">Admin Home</Link>
            <Link href="/admin/courses/view" className="hover:text-yellow-400">View Courses</Link>
            <Link href="/admin/courses/create" className="hover:text-yellow-400">Create Course</Link>
            <Link href="/admin/students/search" className="hover:text-yellow-400">Search Student</Link>
            <Link href="/admin/students/register" className="hover:text-yellow-400">Register Student</Link>
            <Link href="/admin/payment" className="hover:text-yellow-400">Payment</Link>
          </nav>
        </header>

        {/* Main Content */}
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}

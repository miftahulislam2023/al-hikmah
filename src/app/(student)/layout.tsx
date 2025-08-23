import "@/app/globals.css";
import { auth } from "@/auth";
import StudentNavbar from "@/components/student/StudentNavbar";
import Link from "next/link";
import { Poppins } from 'next/font/google'

const poppins = Poppins({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'],
})

export default async function StudentLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await auth()
    const isUser = session?.user.role === "USER";

    return isUser ? (
        <main className={poppins.className}>
            <StudentNavbar />
            {children}
        </main>
    ) : (
        <div className="flex justify-center items-center min-h-screen p-4 bg-gradient-to-br from-white to-[#fd2d61]/10">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg border border-[#fd2d61]/20 overflow-hidden">
                <div className="bg-gradient-to-r from-[#fd2d61] to-[#b02aff] p-6">
                    <h2 className="text-2xl font-bold text-white flex items-center justify-center">
                        Access Restricted
                    </h2>
                </div>
                <div className="p-6 space-y-4">
                    <div className="flex items-center justify-center">
                        <div className="w-20 h-20 bg-[#fd2d61]/10 rounded-full flex items-center justify-center mb-4">
                        </div>
                    </div>
                    <p className="text-center text-[#fd2d61] font-medium">Please login to access this area.</p>
                    <p className="text-center text-gray-500 text-sm">This section is restricted to students only.</p>
                    <div className="flex justify-center mt-2">
                        <Link
                            href="/signin"
                            className="flex items-center justify-center rounded-md bg-gradient-to-r from-[#fd2d61] to-[#b02aff] px-6 py-3 text-sm font-medium text-white transition-colors hover:from-[#fd2d61]/90 hover:to-[#b02aff]/90 focus:outline-none focus:ring-2 focus:ring-[#fd2d61] focus:ring-offset-2"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="mr-2 h-4 w-4"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            Go to Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

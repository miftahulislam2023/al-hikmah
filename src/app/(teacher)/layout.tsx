import "@/app/globals.css";
import { auth } from "@/auth";
import Link from "next/link";
import { Poppins } from 'next/font/google'
import TeacherNavBar from "@/components/teacher/TeacherNavBar";

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
    const isUser = session?.user.role === "TEACHER";

    return isUser ? (
        <main className={poppins.className}>
            <TeacherNavBar />
            {children}
        </main>
    ) : (
        <div className="flex justify-center items-center min-h-screen p-4 bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg border border-indigo-100 overflow-hidden">
                <div className="bg-gradient-to-r from-red-600 to-red-700 p-6">
                    <h2 className="text-2xl font-bold text-white flex items-center justify-center">
                        Access Restricted
                    </h2>
                </div>
                <div className="p-6 space-y-4">
                    <div className="flex items-center justify-center">
                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
                        </div>
                    </div>
                    <p className="text-center text-gray-700 font-medium">Please login to access this area.</p>
                    <p className="text-center text-gray-500 text-sm">This section is restricted to teachers only.</p>
                    <div className="flex justify-center mt-2">
                        <Link
                            href="/signin"
                            className="flex items-center justify-center rounded-md bg-blue-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            Go to Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

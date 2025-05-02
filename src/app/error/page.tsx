import Link from "next/link"

export default function AuthErrorPage() {

    const errorMessage = "An error occurred during authentication. Please check your email and password and try again."

    return (
        <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
            <div className="w-full max-w-md">
                <div className="rounded-lg border border-red-100 bg-white p-8 shadow-lg dark:border-red-800 dark:bg-gray-800 transition-all hover:shadow-xl">
                    <div className="mb-6 flex justify-center">
                        <div className="rounded-full bg-red-100 p-3 dark:bg-red-900">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-10 w-10 text-red-500 dark:text-red-400"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                    </div>
                    <h1 className="mb-4 text-center text-2xl font-bold text-gray-900 dark:text-white">
                        Authentication Error
                    </h1>
                    <div className="mb-6 text-center text-gray-600 dark:text-gray-300">
                        {errorMessage}
                    </div>
                    <div className="flex justify-center">
                        <Link
                            href="/profile/signin"
                            className="flex items-center justify-center rounded-md bg-blue-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-600 dark:hover:bg-blue-700"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="mr-2 h-4 w-4"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            Return to Sign In
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
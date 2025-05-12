"use client"
import Link from "next/link";
import { useState } from "react";
import { LayoutDashboard, UserCog, BookOpen, Menu, X } from "lucide-react";
import { signOut } from "next-auth/react";
import { Button } from "../ui/button";

export default function TeacherNavBar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link
                            href="/teacher"
                            className="font-bold text-xl mr-8 flex items-center"
                        >
                            <span className="hidden sm:inline">Teacher Portal</span>
                            <span className="sm:hidden">Portal</span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex space-x-8">
                            <Link
                                href="/teacher"
                                className="flex items-center space-x-2 py-2 px-3 rounded-md hover:bg-indigo-500 transition-colors duration-200"
                            >
                                <LayoutDashboard size={18} />
                                <span>Dashboard</span>
                            </Link>
                            <Link
                                href="/teacher/courses"
                                className="flex items-center space-x-2 py-2 px-3 rounded-md hover:bg-indigo-500 transition-colors duration-200"
                            >
                                <BookOpen size={18} />
                                <span>My Courses</span>
                            </Link>
                            <Link
                                href="/teacher/profile/edit"
                                className="flex items-center space-x-2 py-2 px-3 rounded-md hover:bg-indigo-500 transition-colors duration-200"
                            >
                                <UserCog size={18} />
                                <span>Profile</span>
                            </Link>
                        </div>
                        <Button
                            onClick={() => signOut({ callbackUrl: "/signin" })}
                            className="ml-4 px-3 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors duration-200 hidden md:inline-flex"
                        >
                            Sign Out
                        </Button>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={toggleMenu}
                            className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-indigo-500 focus:outline-none"
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-indigo-700 px-2 pt-2 pb-3 space-y-1 sm:px-3">
                    <Link
                        href="/teacher"
                        className="flex items-center space-x-3 py-2 px-3 rounded-md hover:bg-indigo-500 transition-colors duration-200"
                        onClick={toggleMenu}
                    >
                        <LayoutDashboard size={18} />
                        <span>Dashboard</span>
                    </Link>
                    <Link
                        href="/teacher/courses"
                        className="flex items-center space-x-3 py-2 px-3 rounded-md hover:bg-indigo-500 transition-colors duration-200"
                        onClick={toggleMenu}
                    >
                        <BookOpen size={18} />
                        <span>My Courses</span>
                    </Link>
                    <Link
                        href="/teacher/profile/edit"
                        className="flex items-center space-x-3 py-2 px-3 rounded-md hover:bg-indigo-500 transition-colors duration-200"
                        onClick={toggleMenu}
                    >
                        <UserCog size={18} />
                        <span>Profile</span>
                    </Link>
                    <button
                        onClick={() => { setIsMenuOpen(false); signOut({ callbackUrl: "/signin" }); }}
                        className="w-full flex items-center justify-center py-2 px-3 rounded-md bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors duration-200 mt-2"
                    >
                        Sign Out
                    </button>
                </div>
            )}
        </nav>
    );
}
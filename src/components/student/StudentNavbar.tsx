"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";
import { Button } from "../ui/button";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function StudentNavbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const toggleMenu = () => setIsMenuOpen((v) => !v);
    return (
        <nav className="bg-white shadow-md sticky top-0 z-30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex items-center gap-2">
                        <Link href="/" className="text-xl font-bold text-blue-600 flex items-center">
                            <span className="mr-2">🏫</span>
                            <span className="hidden sm:inline">Neural Gem School</span>
                            <span className="sm:hidden">Neural Gem</span>
                        </Link>
                    </div>
                    {/* Desktop Nav */}
                    <div className="hidden sm:flex items-center gap-4">
                        <Link href="/profile" className="text-gray-700 hover:text-blue-600 font-medium px-2 py-1 rounded transition">Profile</Link>
                        <Link href="/profile/edit" className="text-gray-700 hover:text-blue-600 font-medium px-2 py-1 rounded transition">Edit</Link>
                        <Link href="/profile/courses" className="text-gray-700 hover:text-blue-600 font-medium px-2 py-1 rounded transition">Courses</Link>
                        <Button onClick={() => signOut({ callbackUrl: "/signin" })} variant="destructive" className="ml-2">Sign Out</Button>
                    </div>
                    {/* Mobile Hamburger */}
                    <div className="sm:hidden flex items-center">
                        <button onClick={toggleMenu} className="p-2 rounded-md text-blue-600 focus:outline-none">
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>
            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="sm:hidden bg-blue-50 border-t border-blue-100 px-4 py-3 space-y-2 animate-in fade-in slide-in-from-top-2">
                    <Link href="/profile" className="block text-blue-700 font-medium py-2 rounded hover:bg-blue-100" onClick={toggleMenu}>Profile</Link>
                    <Link href="/profile/edit" className="block text-blue-700 font-medium py-2 rounded hover:bg-blue-100" onClick={toggleMenu}>Edit</Link>
                    <Link href="/profile/courses" className="block text-blue-700 font-medium py-2 rounded hover:bg-blue-100" onClick={toggleMenu}>Courses</Link>
                    <Button onClick={() => { setIsMenuOpen(false); signOut({ callbackUrl: "/signin" }); }} variant="destructive" className="w-full">Sign Out</Button>
                </div>
            )}
        </nav>
    );
}
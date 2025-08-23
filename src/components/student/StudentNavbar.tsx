"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";
import { Button } from "../ui/button";
import { useState, useEffect } from "react";
import { User, Edit, BookOpen, LogOut } from "lucide-react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

type NavLinkProps = {
    href: string;
    pathname: string;
    icon: React.ComponentType<{ className?: string }>;
    children: React.ReactNode;
};

const NavLink = ({ href, pathname, icon: Icon, children }: NavLinkProps) => {
    const isActive = pathname === href;

    return (
        <Link href={href}>
            <motion.div
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-all duration-200 ${isActive
                    ? 'bg-gradient-to-r from-[#fd2d61]/20 to-[#b02aff]/20 text-[#fd2d61] shadow-sm border border-[#fd2d61]/20'
                    : 'text-gray-600 hover:text-[#fd2d61] hover:bg-[#fd2d61]/10'
                    }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                <Icon className={`h-4 w-4 ${isActive ? 'text-[#fd2d61]' : ''}`} />
                <span>{children}</span>
            </motion.div>
        </Link>
    );
};

export default function StudentNavbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };

        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (isMenuOpen && !target.closest('.mobile-menu-container')) {
                setIsMenuOpen(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        window.addEventListener('click', handleClickOutside);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('click', handleClickOutside);
        };
    }, [isMenuOpen]);

    // Close mobile menu when route changes
    useEffect(() => {
        setIsMenuOpen(false);
    }, [pathname]);

    const toggleMenu = () => setIsMenuOpen((v) => !v);

    return (
        <motion.nav
            className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${scrolled
                ? 'md:bg-white/95 md:backdrop-blur-md md:shadow-lg md:py-2 md:border-b md:border-[#fd2d61]/30'
                : 'md:bg-white/90 md:backdrop-blur-sm md:py-3 md:border-b md:border-[#fd2d61]/20'
                }`}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
        >
            {/* Subtle gradient light effect - only on desktop */}
            <motion.div
                className={`hidden md:block absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent to-transparent ${scrolled
                    ? 'via-[#fd2d61]/70'
                    : 'via-[#fd2d61]/40'
                    }`}
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
            />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="hidden md:flex justify-between items-center">
                    {/* Logo - Visible on desktop */}
                    <div className="flex items-center space-x-2">
                        <Link href="/" className="flex items-center space-x-2 text-[#fd2d61] font-bold group">
                            <motion.div
                                className="w-10 h-10 rounded-lg flex items-center justify-center"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Image src="/icon.png"
                                    alt="Neural Gem Logo"
                                    height={100}
                                    width={100}
                                />
                            </motion.div>
                            <div className="flex flex-col">
                                <span className="text-lg font-bold">
                                    Neural Gem
                                </span>
                                <span className="text-xs text-[#ff9b1b] font-medium -mt-1">Student Portal</span>
                            </div>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="flex items-center space-x-1">
                        <NavLink href="/profile" pathname={pathname} icon={User}>
                            Profile
                        </NavLink>
                        <NavLink href="/profile/edit" pathname={pathname} icon={Edit}>
                            Edit Profile
                        </NavLink>
                        <NavLink href="/profile/courses" pathname={pathname} icon={BookOpen}>
                            My Courses
                        </NavLink>

                        <motion.div
                            className="ml-4"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.97 }}
                        >
                            <Button
                                onClick={() => signOut({ callbackUrl: "/signin" })}
                                variant="destructive"
                                size="sm"
                                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 border-0 shadow-md"
                            >
                                <LogOut className="h-4 w-4 mr-1" />
                                Sign Out
                            </Button>
                        </motion.div>
                    </div>

                    {/* Mobile menu button - hidden since we'll use floating button */}
                    <div className="md:hidden">
                        {/* Mobile navigation handled by floating button */}
                    </div>
                </div>
            </div>

            {/* Floating Mobile Menu Button - positioned like landing page */}
            <div className={`mobile-menu-container fixed top-3 right-3 z-50 block md:hidden ${scrolled ? 'menu-scrolled' : ''}`}>
                {/* 3-dot menu button with student portal styling */}
                <motion.button
                    onClick={toggleMenu}
                    className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-[#fd2d61] to-[#b02aff] rounded-full shadow-lg focus:outline-none transform transition-all duration-300 hover:shadow-xl"
                    whileTap={{ scale: 0.9 }}
                    whileHover={{ scale: 1.1 }}
                    aria-label="Toggle student menu"
                >
                    <motion.div
                        className="flex flex-col items-center justify-center gap-1.5"
                        animate={isMenuOpen ? { rotate: 90 } : { rotate: 0 }}
                        transition={{ staggerChildren: 0.1, delayChildren: 0.1 }}
                    >
                        <motion.div className="w-1.5 h-1.5 rounded-full bg-white"></motion.div>
                        <motion.div className="w-1.5 h-1.5 rounded-full bg-white"></motion.div>
                        <motion.div className="w-1.5 h-1.5 rounded-full bg-white"></motion.div>
                    </motion.div>
                </motion.button>

                {/* Floating Dropdown menu */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, y: -20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.8, y: -20 }}
                            transition={{ type: "spring", stiffness: 300, damping: 24 }}
                            className="absolute top-16 right-0 bg-white/95 backdrop-blur-md w-64 rounded-xl shadow-xl border-2 border-[#fd2d61]/20 overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-[#fd2d61]/5 to-[#b02aff]/5 opacity-70 z-0 overflow-hidden">
                                {/* Decorative particles */}
                                <div className="absolute top-[15%] left-[10%] w-6 h-6 bg-[#fd2d61]/20 opacity-30 rounded-full animate-float"></div>
                                <div className="absolute top-[35%] right-[15%] w-5 h-5 bg-[#b02aff]/20 opacity-30 rounded-full animate-float" style={{ animationDelay: '1.5s' }}></div>
                                <div className="absolute bottom-[25%] left-[20%] w-4 h-4 bg-[#ff9b1b]/20 opacity-30 rounded-full animate-float" style={{ animationDelay: '0.7s' }}></div>
                                <div className="absolute bottom-[15%] right-[10%] w-5 h-5 bg-[#fd2d61]/20 opacity-30 rounded-full animate-float" style={{ animationDelay: '2.1s' }}></div>
                            </div>

                            {/* Top decor element */}
                            <motion.div
                                className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#fd2d61] to-[#b02aff] z-10"
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ delay: 0.1, duration: 0.4 }}
                            ></motion.div>

                            <div className="py-2 relative z-10">
                                <div className="px-3 py-2">
                                    {/* Show Neural Gem branding when scrolled */}
                                    {scrolled && (
                                        <motion.div
                                            className="flex items-center space-x-2 mb-3 pb-2 border-b border-[#fd2d61]/20"
                                            initial={{ x: -20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: 0.1 }}
                                        >
                                            <motion.div
                                                className="w-8 h-8 rounded-lg flex items-center justify-center"
                                                whileHover={{ scale: 1.05 }}
                                            >
                                                <Image src="/icon.png"
                                                    alt="Neural Gem Logo"
                                                    height={32}
                                                    width={32}
                                                    className="rounded"
                                                />
                                            </motion.div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-[#fd2d61]">
                                                    Neural Gem
                                                </span>
                                                <span className="text-xs text-[#ff9b1b] font-medium -mt-0.5">Academy</span>
                                            </div>
                                        </motion.div>
                                    )}
                                    <motion.div
                                        className="text-md font-bold text-[#fd2d61] mb-1"
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: scrolled ? 0.2 : 0.15 }}
                                    >
                                        {/* Student Portal */}
                                        <div className="relative h-[50px] w-[230px]">
                                            <Image
                                                src="/logo/logo.png"
                                                alt="Neural Gem logo"
                                                fill
                                                className="object-cover"
                                                priority
                                            />
                                        </div>
                                    </motion.div>
                                    <div className="h-0.5 w-full bg-gradient-to-r from-[#fd2d61]/30 to-[#b02aff]/30 rounded-full mb-2"></div>
                                </div>

                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: scrolled ? 0.25 : 0.2 }}
                                >
                                    <Link
                                        href="/profile"
                                        className="block px-4 py-2.5 hover:bg-[#fd2d61]/10 text-[#fd2d61] font-medium transition-colors rounded-lg"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <div className="flex items-center">
                                            <span className="text-lg mr-2">🎓</span>
                                            Profile
                                        </div>
                                    </Link>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: scrolled ? 0.3 : 0.25 }}
                                >
                                    <Link
                                        href="/profile/edit"
                                        className="block px-4 py-2.5 hover:bg-[#fd2d61]/10 text-[#fd2d61] font-medium transition-colors rounded-lg"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <div className="flex items-center">
                                            <span className="text-lg mr-2">✏️</span>
                                            Edit Profile
                                        </div>
                                    </Link>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: scrolled ? 0.35 : 0.3 }}
                                >
                                    <Link
                                        href="/profile/courses"
                                        className="block px-4 py-2.5 hover:bg-[#fd2d61]/10 text-[#fd2d61] font-medium transition-colors rounded-lg"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <div className="flex items-center">
                                            <span className="text-lg mr-2">📖</span>
                                            My Courses
                                        </div>
                                    </Link>
                                </motion.div>

                                <motion.div
                                    className="px-3 py-2 mt-1"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: scrolled ? 0.4 : 0.35 }}
                                >
                                    <div className="h-0.5 w-full bg-gradient-to-r from-[#fd2d61]/30 to-[#b02aff]/30 rounded-full mb-1"></div>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: scrolled ? 0.45 : 0.4 }}
                                    className="px-4 py-2"
                                >
                                    <Button
                                        onClick={() => {
                                            setIsMenuOpen(false);
                                            signOut({ callbackUrl: "/signin" });
                                        }}
                                        variant="destructive"
                                        className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 border-0 shadow-md"
                                    >
                                        <LogOut className="h-4 w-4 mr-2" />
                                        Sign Out
                                    </Button>
                                </motion.div>

                                <div className="px-3 py-1.5 mt-1">
                                    <motion.div
                                        className="text-center text-xs font-medium text-[#fd2d61]/80"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: scrolled ? 0.5 : 0.45 }}
                                    >
                                        Neural Gem Academy © {new Date().getFullYear()}
                                    </motion.div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.nav>
    );
}
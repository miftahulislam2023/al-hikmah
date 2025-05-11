"use client";

import { useState, useEffect, memo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import Image from 'next/image';

const LandingNavbar = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (<motion.nav
        className={`hidden md:block fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-lg py-2'
            : 'bg-white/30 backdrop-blur-sm py-3'
            }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
    >
        {/* Subtle gradient light effect when scrolled */}
        {scrolled && (
            <motion.div
                className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
            />
        )}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">                {/* Logo and brand */}                <div className="flex items-center">
                <Link
                    href="/"
                    className="flex items-center space-x-2 text-indigo-800 font-bold logo-link"
                >
                    <Image
                        src="/logo/logo.png"
                        width={50}
                        height={50}
                        alt="Picture of the author"
                    />
                    <div className="text-lg md:text-xl">
                        <span className="">
                            আল-হিকমাহ একাডেমি
                        </span>
                    </div>
                </Link>
            </div>

                {/* Navigation links */}
                <div className="hidden md:flex md:items-center md:space-x-4 lg:space-x-8">
                    <NavLink href="/">
                        <span className="text-md mr-1.5">🏠</span>
                        <span>হোম</span>
                    </NavLink>
                    <NavLink href="/courses">
                        <span className="text-md mr-1.5">🎓</span>
                        <span>কোর্সসমূহ</span>
                    </NavLink>
                    <NavLink href="/about">
                        <span className="text-md mr-1.5">❓</span>
                        <span>আমাদের সম্পর্কে</span>
                    </NavLink>
                    <NavLink
                        href="https://www.facebook.com/alhikmahacademybd"
                        external={true}
                    >
                        <span className="text-md mr-1.5">ⓕ</span>
                        <span>ফেসবুক</span>
                    </NavLink>
                    <div className="flex gap-3 ml-4">                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} transition={{ type: "spring", stiffness: 300, damping: 15 }}>
                        <Button asChild size="sm" variant="outline" className="bg-white hover:bg-indigo-50 text-indigo-700 border border-indigo-200 hover:border-indigo-400 transition-colors rounded-full shadow-sm">
                            <Link href="/signin">
                                <span className="flex items-center px-1">
                                    <span className="text-sm mr-1.5">🔐</span>
                                    সাইন ইন
                                </span>
                            </Link>
                        </Button>
                    </motion.div>                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} transition={{ type: "spring", stiffness: 300, damping: 15 }}>
                            <Button asChild size="sm" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white transition-colors rounded-full border border-indigo-600 shadow-md">
                                <Link href="/signup">
                                    <span className="flex items-center px-1">
                                        <span className="text-sm mr-1.5">✏️</span>
                                        রেজিস্ট্রেশন
                                    </span>
                                </Link>
                            </Button>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    </motion.nav>
    );
};

// Navigation link component
type NavLinkProps = {
    href: string;
    external?: boolean;
    children: React.ReactNode;
};

const NavLink = ({ href, external = false, children }: NavLinkProps) => {
    const linkClasses = "flex items-center text-indigo-700 hover:text-indigo-900 font-medium text-sm hover:bg-indigo-50 py-2 px-3 rounded-lg transition-colors duration-200"; const content = (
        <motion.div
            className="flex items-center"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
        >
            {children}
        </motion.div>
    );

    return external ? (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClasses}
        >
            {content}
        </a>
    ) : (
        <Link href={href} className={linkClasses}>
            {content}
        </Link>
    );
};

export default memo(LandingNavbar);

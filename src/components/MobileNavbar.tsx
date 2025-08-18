"use client";

import { useState, useEffect, memo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const MobileNavbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };

        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (isOpen && !target.closest('.mobile-menu-container')) {
                setIsOpen(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        window.addEventListener('click', handleClickOutside);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('click', handleClickOutside);
        };
    }, [isOpen]);

    // Close menu when navigation occurs
    useEffect(() => {
        const handleRouteChange = () => {
            setIsOpen(false);
        };

        window.addEventListener('popstate', handleRouteChange);
        return () => {
            window.removeEventListener('popstate', handleRouteChange);
        };
    }, []);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    // Button animation variants
    const dotContainerVariants = {
        open: {
            rotate: 90,
            transition: { staggerChildren: 0.1, delayChildren: 0.1 }
        },
        closed: {
            rotate: 0,
            transition: { staggerChildren: 0.05, staggerDirection: -1 }
        }
    };

    const dotVariants = {
        open: {
            y: 0,
            x: 0,
            opacity: 1,
            transition: { duration: 0.4, type: "spring" }
        },
        closed: {
            y: 0,
            x: 0,
            opacity: 1,
            transition: { duration: 0.4, type: "spring" }
        }
    }; return (
        <div className={`mobile-menu-container fixed top-3 right-3 z-50 block md:hidden ${scrolled ? 'menu-scrolled' : ''}`}>
            {/* 3-dot menu button with fun styling */}
            <motion.button
                onClick={toggleMenu}
                className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full shadow-lg focus:outline-none transform transition-all duration-300 hover:shadow-xl"
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.1 }}
                aria-label="Toggle menu"
            >
                <motion.div
                    className="flex flex-col items-center justify-center gap-1.5"
                    variants={dotContainerVariants}
                    animate={isOpen ? "open" : "closed"}
                >
                    <motion.div
                        className="w-1.5 h-1.5 rounded-full bg-white"
                        variants={dotVariants}
                    ></motion.div>
                    <motion.div
                        className="w-1.5 h-1.5 rounded-full bg-white"
                        variants={dotVariants}
                    ></motion.div>
                    <motion.div
                        className="w-1.5 h-1.5 rounded-full bg-white"
                        variants={dotVariants}
                    ></motion.div>
                </motion.div>
            </motion.button>      {/* Dropdown menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: -20 }}
                        transition={{ type: "spring", stiffness: 300, damping: 24 }}
                        className="absolute top-16 right-0 bg-white/90 backdrop-blur-md w-56 rounded-xl shadow-xl border-2 border-indigo-100 overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-purple-50 opacity-70 z-0 overflow-hidden">
                            {/* Decorative particles for a fun educational feel */}
                            <div className="absolute top-[15%] left-[10%] w-6 h-6 bg-blue-200 opacity-30 rounded-full animate-float"></div>
                            <div className="absolute top-[35%] right-[15%] w-5 h-5 bg-purple-200 opacity-30 rounded-full animate-float" style={{ animationDelay: '1.5s' }}></div>
                            <div className="absolute bottom-[25%] left-[20%] w-4 h-4 bg-pink-200 opacity-30 rounded-full animate-float" style={{ animationDelay: '0.7s' }}></div>
                            <div className="absolute bottom-[15%] right-[10%] w-5 h-5 bg-indigo-200 opacity-30 rounded-full animate-float" style={{ animationDelay: '2.1s' }}></div>
                        </div>

                        {/* Top decor element */}
                        <motion.div
                            className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-400 to-purple-500 z-10"
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ delay: 0.1, duration: 0.4 }}
                        ></motion.div>

                        <div className="py-2 relative z-10">
                            <div className="px-3 py-2">
                                <motion.div
                                    className="text-md font-bold text-indigo-800 mb-1"
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.15 }}
                                >
                                    Neural Gem Academy
                                </motion.div>
                                <div className="h-0.5 w-full bg-gradient-to-r from-indigo-200 to-purple-200 rounded-full mb-2"></div>
                            </div>              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <Link
                                    href="/"
                                    className="block px-4 py-2.5 hover:bg-indigo-100 text-indigo-700 font-medium transition-colors rounded-lg"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <div className="flex items-center">
                                        <span className="text-lg mr-2">🏠</span>
                                        হোম
                                    </div>
                                </Link>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.25 }}
                            >
                                <Link
                                    href="/signin"
                                    className="block px-4 py-2.5 hover:bg-indigo-100 text-indigo-700 font-medium transition-colors rounded-lg"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <div className="flex items-center">
                                        <span className="text-lg mr-2">🔐</span>
                                        সাইন ইন করুন
                                    </div>
                                </Link>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <Link
                                    href="/signup"
                                    className="block px-4 py-2.5 hover:bg-indigo-100 text-indigo-700 font-medium transition-colors rounded-lg"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <div className="flex items-center">
                                        <span className="text-lg mr-2">✏️</span>
                                        নতুন রেজিস্ট্রেশন
                                    </div>
                                </Link>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.35 }}
                            >
                                <Link
                                    href="/courses"
                                    className="block px-4 py-2.5 hover:bg-indigo-100 text-indigo-700 font-medium transition-colors rounded-lg"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <div className="flex items-center">
                                        <span className="text-lg mr-2">🎓</span>
                                        কোর্সসমূহ
                                    </div>
                                </Link>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                <Link
                                    href="/about"
                                    className="block px-4 py-2.5 hover:bg-indigo-100 text-indigo-700 font-medium transition-colors rounded-lg"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <div className="flex items-center">
                                        <span className="text-lg mr-2">❓</span>
                                        আমাদের সম্পর্কে
                                    </div>
                                </Link>
                            </motion.div>

                            <motion.div
                                className="px-3 py-2 mt-1"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.45 }}
                            >
                                <div className="h-0.5 w-full bg-gradient-to-r from-indigo-200 to-purple-200 rounded-full mb-1"></div>
                            </motion.div>              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                            >
                                <a
                                    href="https://www.facebook.com/alhikmahacademybd"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block px-4 py-2.5 hover:bg-indigo-100 text-indigo-700 font-medium transition-colors rounded-lg"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <div className="flex items-center">
                                        <span className="text-lg mr-2">ⓕ</span>ফেসবুক
                                    </div>
                                </a>
                            </motion.div>

                            <div className="px-3 py-1.5 mt-1">
                                <motion.div
                                    className="text-center text-xs font-medium text-indigo-500/80"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.55 }}
                                >
                                    Neural Gem Academy © {new Date().getFullYear()}
                                </motion.div>              </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default memo(MobileNavbar);

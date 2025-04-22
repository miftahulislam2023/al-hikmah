"use client"
import Link from 'next/link'
import React, { useState } from 'react'

const StudentProfile = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100">
            {/* Modern Navigation Bar */}
            <nav className="bg-white shadow-md px-4 sm:px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center">
                        <h1 className="text-xl sm:text-2xl font-bold text-indigo-600">Al-Hikmah</h1>
                        <span className="ml-2 bg-yellow-400 text-xs font-semibold px-2 py-1 rounded-full text-indigo-800">STUDENT</span>
                    </div>

                    {/* Mobile menu button */}
                    <div className="lg:hidden">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="text-gray-500 hover:text-gray-700 focus:outline-none"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                            </svg>
                        </button>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex space-x-1">
                        <NavLink href="/home" label="Home" />
                        <NavLink href="/profile" label="My Profile" active />
                        <NavLink href="/profile/edit" label="Edit Profile" />
                        <NavLink href="/courses" label="My Courses" />
                        <NavLink href="/payments" label="Payments" />
                    </div>
                </div>

                {/* Mobile Navigation */}
                {mobileMenuOpen && (
                    <div className="lg:hidden mt-4 pt-4 border-t border-gray-200">
                        <div className="flex flex-col space-y-2">
                            <NavLink href="/home" label="Home" />
                            <NavLink href="/profile" label="My Profile" active />
                            <NavLink href="/profile/edit" label="Edit Profile" />
                            <NavLink href="/courses" label="My Courses" />
                            <NavLink href="/payments" label="Payments" />
                        </div>
                    </div>
                )}
            </nav>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto pt-8 sm:pt-16 px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-4 sm:px-8 py-8 sm:py-12 text-center">
                        <div className="inline-block rounded-full bg-white p-2 mb-4">
                            <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-indigo-100 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 sm:w-12 sm:h-12 text-indigo-600">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                </svg>
                            </div>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Student Profile</h1>
                        <p className="text-indigo-100">Class of 2025</p>
                    </div>

                    <div className="px-4 sm:px-8 py-6 sm:py-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                            <ProfileCard
                                title="Personal Information"
                                items={[
                                    { label: "Name", value: "Student Name" },
                                    { label: "Roll Number", value: "2023001" },
                                    { label: "Class", value: "X" },
                                    { label: "Batch", value: "2025" },
                                ]}
                            />

                            <ProfileCard
                                title="Academic Details"
                                items={[
                                    { label: "Enrolled Courses", value: "3" },
                                    { label: "Completed Courses", value: "5" },
                                    { label: "Current GPA", value: "3.75" },
                                    { label: "Attendance", value: "95%" },
                                ]}
                            />
                        </div>

                        <div className="mt-8 sm:mt-10 border-t border-gray-200 pt-6 sm:pt-8">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
                            <div className="space-y-4">
                                <ActivityItem
                                    title="Assignment Submitted"
                                    description="Mathematics - Algebra II"
                                    date="Yesterday"
                                    icon="📝"
                                />
                                <ActivityItem
                                    title="Course Enrolled"
                                    description="Physics - Mechanics"
                                    date="3 days ago"
                                    icon="📚"
                                />
                                <ActivityItem
                                    title="Quiz Completed"
                                    description="Computer Science - Algorithms"
                                    date="1 week ago"
                                    icon="✅"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 sm:mt-10 text-center text-sm text-gray-500 pb-8">
                    <p>Al-Hikmah Academy © 2025 • Student Portal</p>
                </div>
            </div>
        </div>
    )
}

// Navigation Link Component
const NavLink = ({ href, label, active = false }) => {
    return (
        <Link href={href} className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${active
            ? 'bg-indigo-100 text-indigo-700'
            : 'text-gray-600 hover:bg-gray-100'
            } w-full lg:w-auto text-center lg:text-left`}>
            {label}
        </Link>
    )
}

// Profile Card Component
const ProfileCard = ({ title, items }) => {
    return (
        <div className="bg-gray-50 rounded-xl p-4 sm:p-6">
            <h3 className="font-medium text-lg text-gray-900 mb-4">{title}</h3>
            <div className="space-y-3">
                {items.map((item, index) => (
                    <div key={index} className="flex flex-col sm:flex-row sm:justify-between">
                        <span className="text-gray-500 mb-1 sm:mb-0">{item.label}</span>
                        <span className="font-medium text-gray-900">{item.value}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

// Activity Item Component
const ActivityItem = ({ title, description, date, icon }) => {
    return (
        <div className="flex items-start">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-lg">
                {icon}
            </div>
            <div className="ml-4 flex-1">
                <h4 className="text-base font-medium text-gray-900">{title}</h4>
                <p className="text-sm text-gray-500">{description}</p>
                <span className="text-xs text-indigo-600">{date}</span>
            </div>
        </div>
    )
}

export default StudentProfile
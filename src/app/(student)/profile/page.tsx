import { auth } from '@/auth';

export default async function StudentProfile() {
    const session = await auth()
    const user = session.user;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-10 px-4">
            <div className="max-w-5xl mx-auto">
                {/* Profile Header */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 pt-8 pb-16 px-8 relative">
                        <h1 className="text-3xl font-bold text-white mb-1">Student Profile</h1>
                        <p className="text-blue-100">Neural Gem Academy</p>

                        {/* Decorative Elements */}
                        <div className="absolute top-0 right-0 w-48 h-48 bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
                    </div>

                    {/* Avatar and Basic Info Card */}
                    <div className="px-8 -mt-12 pb-6 relative z-10">
                        <div className="flex flex-col md:flex-row items-center md:items-start bg-white rounded-xl shadow-md p-6 border border-indigo-50">
                            <div className="flex-shrink-0 mb-6 md:mb-0 md:mr-8">
                                <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-lg relative bg-blue-50">
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="text-6xl font-bold text-blue-300">
                                            {user.name ? user.name.charAt(0).toUpperCase() : '?'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex-grow text-center md:text-left">
                                <h2 className="text-2xl font-bold text-gray-800">{user.name || 'Student'}</h2>
                                <p className="text-indigo-600">Roll: {user.roll || 'Not assigned'}</p>
                                <div className="mt-3 flex flex-wrap justify-center md:justify-start gap-3">
                                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                        {user.currentClass || 'No Class'} Student
                                    </span>
                                    <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
                                        SSC Batch: {user.sscBatch || 'N/A'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Profile Content */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Personal Information */}
                    <div className="bg-white rounded-xl shadow-md overflow-hidden col-span-1">
                        <div className="p-5 bg-gradient-to-r from-blue-500 to-blue-600">
                            <h2 className="text-xl font-bold text-white flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                </svg>
                                Personal Info
                            </h2>
                        </div>
                        <div className="p-5 space-y-4">
                            <div>
                                <span className="text-sm text-indigo-500">Email</span>
                                <p className="text-gray-700">{user.email || 'Not provided'}</p>
                            </div>
                            <div>
                                <span className="text-sm text-indigo-500">Phone</span>
                                <p className="text-gray-700">{user.phone || 'Not provided'}</p>
                            </div>
                            <div>
                                <span className="text-sm text-indigo-500">Date of Birth</span>
                                <p className="text-gray-700">
                                    {user.dob ? new Date(user.dob).toLocaleDateString('en-US', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric'
                                    }) : 'Not provided'}
                                </p>
                            </div>
                            <div>
                                <span className="text-sm text-indigo-500">Gender</span>
                                <p className="text-gray-700">{user.gender || 'Not provided'}</p>
                            </div>
                            <div>
                                <span className="text-sm text-indigo-500">Address</span>
                                <p className="text-gray-700">{user.address || 'Not provided'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Academic Information */}
                    <div className="bg-white rounded-xl shadow-md overflow-hidden col-span-1">
                        <div className="p-5 bg-gradient-to-r from-indigo-500 to-indigo-600">
                            <h2 className="text-xl font-bold text-white flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                                </svg>
                                Academic Info
                            </h2>
                        </div>
                        <div className="p-5 space-y-4">
                            <div>
                                <span className="text-sm text-indigo-500">Current Institute</span>
                                <p className="text-gray-700">{user.currentInstitute || 'Not provided'}</p>
                            </div>
                            <div>
                                <span className="text-sm text-indigo-500">Current Class</span>
                                <p className="text-gray-700">{user.currentClass || 'Not provided'}</p>
                            </div>
                            <div>
                                <span className="text-sm text-indigo-500">Roll Number</span>
                                <p className="text-gray-700">{user.roll || 'Not provided'}</p>
                            </div>
                            <div>
                                <span className="text-sm text-indigo-500">SSC Batch</span>
                                <p className="text-gray-700">{user.sscBatch || 'Not provided'}</p>
                            </div>

                            {/* Student Badge */}
                            <div className="flex justify-center mt-4">
                                <div className="py-3 px-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg border border-indigo-100 text-center">
                                    <div className="text-sm text-indigo-500">Student Since</div>
                                    <div className="text-indigo-700 font-bold">2025</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Guardian Information */}
                    <div className="bg-white rounded-xl shadow-md overflow-hidden col-span-1">
                        <div className="p-5 bg-gradient-to-r from-purple-500 to-purple-600">
                            <h2 className="text-xl font-bold text-white flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                                </svg>
                                Guardian Info
                            </h2>
                        </div>
                        <div className="p-5 space-y-4">
                            <div>
                                <span className="text-sm text-indigo-500">Guardian Name</span>
                                <p className="text-gray-700">{user.guardianName || 'Not provided'}</p>
                            </div>
                            <div>
                                <span className="text-sm text-indigo-500">Guardian Phone</span>
                                <p className="text-gray-700">{user.guardianPhone || 'Not provided'}</p>
                            </div>
                            <div>
                                <span className="text-sm text-indigo-500">Guardian Occupation</span>
                                <p className="text-gray-700">{user.guardianOccupation || 'Not provided'}</p>
                            </div>

                            {/* Emergency Contact Badge */}
                            <div className="flex justify-center mt-6">
                                <div className="py-2 px-4 bg-red-50 rounded-full border border-red-100 flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-red-700 text-sm">Emergency Contact</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Motivational Quote */}
                <div className="mt-6 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-xl shadow-lg p-6 text-center">
                    <blockquote className="text-white italic text-lg">
                        &ldquo;Education is the most powerful weapon which you can use to change the world.&rdquo;
                    </blockquote>
                    <p className="text-blue-200 mt-2">- Nelson Mandela</p>
                </div>
                <div className="mt-8 text-center text-gray-500 text-sm">
                    <p>Neural Gem Academy Student Portal • 2025</p>
                </div>
            </div>
        </div>
    )
}
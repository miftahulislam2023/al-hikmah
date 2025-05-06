import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { auth } from "@/auth";
import { getBoughtCourses } from "@/actions/course";

export default async function ViewCourses() {
    // Get the current authenticated student
    const session = await auth();
    const studentId = session?.user?.id ? parseInt(session.user.id) : null;

    // Fetch all courses
    const allCourses = await prisma.course.findMany({
        where: { isActive: true },
        orderBy: { semester: 'asc' }
    });

    // Fetch enrolled courses for the student
    const enrolledCourses = studentId ? await getBoughtCourses(studentId) : [];

    // Filter available courses (not enrolled)
    const enrolledCourseIds = enrolledCourses && !('error' in enrolledCourses)
        ? enrolledCourses.map(course => course.id)
        : [];
    const availableCourses = allCourses.filter(course => !enrolledCourseIds.includes(course.id));

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-6 py-14">
            <div className="max-w-7xl mx-auto">
                {/* Page header */}
                <header className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                        My Learning Journey
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Track your enrolled courses and discover new opportunities to enhance your academic excellence
                    </p>
                </header>

                {/* Enrolled courses section */}
                {enrolledCourses && !('error' in enrolledCourses) && enrolledCourses.length > 0 && (
                    <section className="mb-16">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold text-gray-800">My Enrolled Courses</h2>
                            <div className="px-4 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                {enrolledCourses.length} {enrolledCourses.length === 1 ? 'Course' : 'Courses'}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {enrolledCourses.map((course) => (
                                <Card
                                    key={course.id}
                                    className="rounded-xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden bg-white"
                                >
                                    <div className="h-2 bg-blue-600"></div>
                                    <CardHeader className="p-6 pb-3">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="bg-blue-100 text-blue-700 rounded-full px-3 py-1 text-xs font-semibold">
                                                Semester {course.semester}
                                            </span>
                                            <span className="text-emerald-500 flex items-center text-sm font-medium">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                                Enrolled
                                            </span>
                                        </div>
                                        <CardTitle className="text-xl font-bold text-gray-800">
                                            {course.title}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-6 pt-2">
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center text-sm border-b border-gray-100 pb-3">
                                                <span className="text-gray-500">Course Fee</span>
                                                <span className="font-semibold">৳ {course.fee}</span>
                                            </div>
                                            <Link href={`/profile/courses/${course.id}`} className="block mt-4">
                                                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                                                    Continue Learning
                                                </Button>
                                            </Link>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </section>
                )}

                {/* Available courses section */}
                <section>
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold text-gray-800">Available Courses</h2>
                        <div className="px-4 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                            {availableCourses.length} {availableCourses.length === 1 ? 'Course' : 'Courses'}
                        </div>
                    </div>

                    {availableCourses.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {availableCourses.map((course) => (
                                <Card
                                    key={course.id}
                                    className="rounded-xl border border-gray-100 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden bg-white group"
                                >
                                    <CardHeader className="p-6 pb-3 bg-gradient-to-r from-gray-50 to-white">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="bg-gray-100 text-gray-700 rounded-full px-3 py-1 text-xs font-semibold">
                                                Semester {course.semester}
                                            </span>
                                            {course.isActive ? (
                                                <span className="text-green-500 text-sm font-medium">
                                                    Open for Enrollment
                                                </span>
                                            ) : (
                                                <span className="text-red-500 text-sm font-medium">
                                                    Enrollment Closed
                                                </span>
                                            )}
                                        </div>
                                        <CardTitle className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                                            {course.title}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-6 pt-2">
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center text-sm border-b border-gray-100 pb-3">
                                                <span className="text-gray-500">Course Fee</span>
                                                <span className="font-semibold">৳ {course.fee}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-500 text-sm">Course Details</span>
                                                <span className="text-sm text-gray-600">Standard curriculum</span>
                                            </div>
                                            <Link href={`/profile/courses/${course.id}`} className="block mt-4">
                                                <Button className="w-full bg-gray-800 hover:bg-gray-900 group-hover:bg-blue-600">
                                                    View Details
                                                </Button>
                                            </Link>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl p-10 text-center shadow-md">
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">You&apos;re All Set!</h3>
                            <p className="text-gray-600">You&apos;ve enrolled in all our available courses. Check your enrolled courses section above.</p>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}

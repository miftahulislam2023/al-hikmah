import { getActiveCourses } from "@/actions/course";
import { getStudentEnrollments } from "@/actions/enrollment";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import prisma from "@/lib/prisma";

export default async function BrowseCoursesPage() {
    const session = await auth();
    if (!session || session.user?.role !== "STUDENT") {
        redirect("/signin");
    }

    // Get student ID from the database
    const student = await prisma.student.findUnique({
        where: { userId: session.user.id },
        select: { id: true }
    });

    if (!student) {
        redirect("/signin");
    }

    const [coursesResult, enrollmentsResult] = await Promise.all([
        getActiveCourses(),
        getStudentEnrollments(student.id)
    ]);

    if (coursesResult.error) {
        return (
            <div className="container mx-auto p-6">
                <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
                <p className="text-red-500">{coursesResult.error}</p>
            </div>
        );
    }

    const courses = coursesResult.data || [];
    const enrollments = enrollmentsResult.data || [];
    const enrolledCourseIds = enrollments.map(e => e.courseId);

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Browse Courses</h1>
                    <p className="text-gray-600">Discover and enroll in amazing courses</p>
                </div>
                <div className="flex gap-3">
                    <Badge variant="secondary" className="text-lg px-3 py-1">
                        {courses.length} Available
                    </Badge>
                    <Badge variant="outline" className="text-lg px-3 py-1">
                        {enrollments.filter(e => e.paymentStatus === "VERIFIED").length} Enrolled
                    </Badge>
                    <Link href="/profile/courses">
                        <Button variant="outline">
                            My Courses
                        </Button>
                    </Link>
                </div>
            </div>

            {courses.length === 0 ? (
                <Card>
                    <CardContent className="text-center py-12">
                        <div className="text-gray-400 text-6xl mb-4">📚</div>
                        <h3 className="text-xl font-medium text-gray-700 mb-2">No Courses Available</h3>
                        <p className="text-gray-500 mb-6">Check back later for new courses.</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course) => {
                        const isEnrolled = enrolledCourseIds.includes(course.id);
                        const enrollment = enrollments.find(e => e.courseId === course.id);

                        return (
                            <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                                {/* Course Image */}
                                <div className="relative h-48 bg-gradient-to-br from-blue-400 to-purple-600">
                                    {course.posterUrl ? (
                                        <Image
                                            src={course.posterUrl}
                                            alt={course.title}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full">
                                            <div className="text-white text-6xl">📚</div>
                                        </div>
                                    )}
                                    <div className="absolute top-4 right-4">
                                        <Badge variant="secondary" className="bg-white/90 text-gray-800">
                                            ${course.price}
                                        </Badge>
                                    </div>
                                </div>

                                <CardHeader>
                                    <CardTitle className="text-lg line-clamp-2">
                                        {course.title}
                                    </CardTitle>
                                    <p className="text-sm text-gray-600 line-clamp-3">
                                        {course.description || "No description available"}
                                    </p>
                                    <div className="flex gap-2 mt-2">
                                        {course.semester && (
                                            <Badge variant="outline" className="text-xs">
                                                {course.semester}
                                            </Badge>
                                        )}
                                        <Badge variant="outline" className="text-xs">
                                            {course._count.lectures} Lectures
                                        </Badge>
                                    </div>
                                </CardHeader>

                                <CardContent className="space-y-4">
                                    {/* Teachers */}
                                    <div>
                                        <p className="text-sm font-medium text-gray-700 mb-2">Instructors:</p>
                                        {course.teachers.length === 0 ? (
                                            <p className="text-sm text-gray-500 italic">No instructors assigned</p>
                                        ) : (
                                            <div className="space-y-1">
                                                {course.teachers.slice(0, 2).map((teacher) => (
                                                    <p key={teacher.id} className="text-sm text-gray-600">
                                                        👨‍🏫 {teacher.user.name || "Unnamed Teacher"}
                                                    </p>
                                                ))}
                                                {course.teachers.length > 2 && (
                                                    <p className="text-sm text-gray-500">
                                                        +{course.teachers.length - 2} more
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Course Stats */}
                                    <div className="grid grid-cols-2 gap-4 text-center bg-gray-50 p-3 rounded-lg">
                                        <div>
                                            <div className="text-lg font-semibold text-blue-600">
                                                {course._count.enrollments}
                                            </div>
                                            <div className="text-xs text-gray-600">Students</div>
                                        </div>
                                        <div>
                                            <div className="text-lg font-semibold text-blue-600">
                                                {course._count.lectures}
                                            </div>
                                            <div className="text-xs text-gray-600">Lectures</div>
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    <div className="pt-2">
                                        {isEnrolled ? (
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <Badge
                                                        variant={
                                                            enrollment?.paymentStatus === "VERIFIED" ? "default" :
                                                                enrollment?.paymentStatus === "PENDING" ? "secondary" :
                                                                    "destructive"
                                                        }
                                                        className="text-xs"
                                                    >
                                                        {enrollment?.paymentStatus === "VERIFIED" ? "✅ Enrolled" :
                                                            enrollment?.paymentStatus === "PENDING" ? "⏳ Payment Pending" :
                                                                "❌ Payment Rejected"}
                                                    </Badge>
                                                </div>
                                                {enrollment?.paymentStatus === "VERIFIED" ? (
                                                    <Link href={`/profile/courses/${course.id}`}>
                                                        <Button className="w-full" size="sm">
                                                            Continue Learning
                                                        </Button>
                                                    </Link>
                                                ) : enrollment?.paymentStatus === "PENDING" ? (
                                                    <Button variant="outline" className="w-full" size="sm" disabled>
                                                        Payment Under Review
                                                    </Button>
                                                ) : (
                                                    <Link href={`/profile/courses/browse/${course.id}`}>
                                                        <Button variant="outline" className="w-full" size="sm">
                                                            Try Again
                                                        </Button>
                                                    </Link>
                                                )}
                                            </div>
                                        ) : (
                                            <Link href={`/profile/courses/browse/${course.id}`}>
                                                <Button className="w-full bg-green-600 hover:bg-green-700" size="sm">
                                                    {course.price === 0 ? "Enroll Free" : `Enroll - $${course.price}`}
                                                </Button>
                                            </Link>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}

            {/* Browse Categories */}
            {courses.length > 0 && (
                <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                    <CardHeader>
                        <CardTitle className="text-blue-800">Course Categories</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">
                                    {courses.filter(c => c.price === 0).length}
                                </div>
                                <div className="text-sm text-blue-700">Free Courses</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">
                                    {courses.filter(c => c.price > 0).length}
                                </div>
                                <div className="text-sm text-blue-700">Premium Courses</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">
                                    {courses.filter(c => c.teachers.length > 0).length}
                                </div>
                                <div className="text-sm text-blue-700">With Instructors</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">
                                    {courses.reduce((sum, c) => sum + c._count.lectures, 0)}
                                </div>
                                <div className="text-sm text-blue-700">Total Lectures</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

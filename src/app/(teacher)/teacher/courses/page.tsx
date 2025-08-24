import { getTeacherCourses } from "@/actions/course";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { auth } from "@/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

export default async function TeacherCoursesPage() {
    const session = await auth();
    if (!session || session.user?.role !== "TEACHER") {
        redirect("/signin");
    }

    // Get the teacher from the database
    const teacher = await prisma.teacher.findUnique({
        where: { userId: session.user.id },
        select: { id: true }
    });

    if (!teacher) {
        redirect("/signin");
    }

    const { data: courses, error } = await getTeacherCourses(teacher.id);

    if (error) {
        return (
            <div className="container mx-auto p-6">
                <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
                <p className="text-red-500">{error}</p>
                <Link href="/teacher">
                    <Button variant="outline">← Back to Dashboard</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">My Assigned Courses</h1>
                    <p className="text-gray-600">Manage your course content and monitor student progress</p>
                </div>
                <div className="flex gap-3">
                    <Badge variant="secondary" className="text-lg px-3 py-1">
                        {courses?.length || 0} Courses
                    </Badge>
                    <Link href="/teacher">
                        <Button variant="outline">
                            Dashboard
                        </Button>
                    </Link>
                </div>
            </div>

            {!courses || courses.length === 0 ? (
                <Card>
                    <CardContent className="text-center py-12">
                        <div className="text-gray-400 text-6xl mb-4">📚</div>
                        <h3 className="text-xl font-medium text-gray-700 mb-2">No Courses Assigned</h3>
                        <p className="text-gray-500 mb-6">
                            You haven&apos;t been assigned to any courses yet. Contact your administrator.
                        </p>
                        <Link href="/teacher">
                            <Button variant="outline">
                                Go to Dashboard
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course) => (
                        <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                            {/* Course Header */}
                            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white">
                                <h3 className="font-semibold text-lg line-clamp-2">{course.title}</h3>
                                <div className="flex gap-2 mt-2">
                                    <Badge
                                        variant={course.isActive ? "default" : "secondary"}
                                        className={course.isActive ? "bg-green-600" : "bg-gray-500"}
                                    >
                                        {course.isActive ? "Active" : "Inactive"}
                                    </Badge>
                                    {course.semester && (
                                        <Badge variant="outline" className="bg-white/20 text-white border-white/30">
                                            {course.semester}
                                        </Badge>
                                    )}
                                </div>
                            </div>

                            <CardContent className="p-4 space-y-4">
                                {/* Course Description */}
                                <p className="text-gray-600 text-sm line-clamp-3">
                                    {course.description || "No description available"}
                                </p>

                                {/* Course Stats */}
                                <div className="grid grid-cols-3 gap-3 text-center bg-gray-50 p-3 rounded-lg">
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
                                    <div>
                                        <div className="text-lg font-semibold text-blue-600">
                                            {course._count.quizzes}
                                        </div>
                                        <div className="text-xs text-gray-600">Quizzes</div>
                                    </div>
                                </div>

                                {/* Course Details */}
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Price:</span>
                                        <span className="font-medium">${course.price}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Co-Teachers:</span>
                                        <span className="font-medium">{course.teachers.length}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Created:</span>
                                        <span className="font-medium">
                                            {new Date(course.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2 pt-2">
                                    <Link href={`/teacher/courses/${course.id}`} className="flex-1">
                                        <Button className="w-full bg-blue-600 hover:bg-blue-700">
                                            Manage Course
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Teacher Summary */}
            {courses && courses.length > 0 && (
                <Card className="bg-blue-50 border-blue-200">
                    <CardHeader>
                        <CardTitle className="text-blue-800">Teaching Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                            <div>
                                <div className="text-2xl font-bold text-blue-600">
                                    {courses.length}
                                </div>
                                <div className="text-sm text-blue-700">Total Courses</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-blue-600">
                                    {courses.filter(c => c.isActive).length}
                                </div>
                                <div className="text-sm text-blue-700">Active Courses</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-blue-600">
                                    {courses.reduce((sum, c) => sum + c._count.enrollments, 0)}
                                </div>
                                <div className="text-sm text-blue-700">Total Students</div>
                            </div>
                            <div>
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

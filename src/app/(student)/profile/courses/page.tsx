import { getStudentEnrollments } from "@/actions/enrollment";
import { getStudentProgress } from "@/actions/lecture";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import prisma from "@/lib/prisma";
import { Progress } from "@/components/ui/progress";

export default async function StudentCoursesPage() {
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

    const enrollmentsResult = await getStudentEnrollments(student.id);

    if (enrollmentsResult.error) {
        return (
            <div className="container mx-auto p-6">
                <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
                <p className="text-red-500">{enrollmentsResult.error}</p>
            </div>
        );
    }

    const enrollments = enrollmentsResult.data || [];
    const verifiedEnrollments = enrollments.filter(e => e.paymentStatus === "VERIFIED");
    const pendingEnrollments = enrollments.filter(e => e.paymentStatus === "PENDING");

    // Get progress for verified enrollments
    const progressData = await Promise.all(
        verifiedEnrollments.map(async (enrollment) => {
            const progressResult = await getStudentProgress(student.id, enrollment.courseId);
            return {
                courseId: enrollment.courseId,
                progress: progressResult.data || []
            };
        })
    );

    const progressMap = Object.fromEntries(
        progressData.map(p => [p.courseId, p.progress])
    );

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">My Courses</h1>
                    <p className="text-gray-600">Continue your learning journey</p>
                </div>
                <div className="flex gap-3">
                    <Badge variant="default" className="text-lg px-3 py-1">
                        {verifiedEnrollments.length} Active
                    </Badge>
                    {pendingEnrollments.length > 0 && (
                        <Badge variant="secondary" className="text-lg px-3 py-1">
                            {pendingEnrollments.length} Pending
                        </Badge>
                    )}
                    <Link href="/profile/courses/browse">
                        <Button variant="outline">
                            Browse More Courses
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Pending Payments Alert */}
            {pendingEnrollments.length > 0 && (
                <Card className="border-yellow-200 bg-yellow-50">
                    <CardHeader>
                        <CardTitle className="text-yellow-800 text-lg">⏳ Pending Enrollments</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-yellow-700 mb-3">
                            You have {pendingEnrollments.length} course(s) waiting for payment verification.
                        </p>
                        <div className="space-y-2">
                            {pendingEnrollments.map((enrollment) => (
                                <div key={enrollment.id} className="flex items-center justify-between bg-white p-3 rounded border">
                                    <div>
                                        <p className="font-medium">{enrollment.course.title}</p>
                                        <p className="text-sm text-gray-600">
                                            Enrolled: {new Date(enrollment.enrolledAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <Badge variant="secondary">Payment Review</Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Active Courses */}
            {verifiedEnrollments.length === 0 && pendingEnrollments.length === 0 ? (
                <Card>
                    <CardContent className="text-center py-12">
                        <div className="text-gray-400 text-6xl mb-4">📚</div>
                        <h3 className="text-xl font-medium text-gray-700 mb-2">No Courses Yet</h3>
                        <p className="text-gray-500 mb-6">Start your learning journey by enrolling in courses.</p>
                        <Link href="/profile/courses/browse">
                            <Button className="bg-blue-600 hover:bg-blue-700">
                                Browse Available Courses
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            ) : verifiedEnrollments.length === 0 ? (
                <Card>
                    <CardContent className="text-center py-12">
                        <div className="text-gray-400 text-6xl mb-4">⏳</div>
                        <h3 className="text-xl font-medium text-gray-700 mb-2">Courses Under Review</h3>
                        <p className="text-gray-500 mb-6">
                            Your payment(s) are being verified. You&apos;ll have access once approved.
                        </p>
                        <Link href="/profile/courses/browse">
                            <Button variant="outline">
                                Browse More Courses
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {verifiedEnrollments.map((enrollment) => {
                        const course = enrollment.course;
                        const courseProgress = progressMap[course.id] || [];
                        const totalLectures = course._count.lectures;
                        const completedLectures = courseProgress.length;
                        const progressPercentage = totalLectures > 0 ? (completedLectures / totalLectures) * 100 : 0;

                        return (
                            <Card key={enrollment.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                                {/* Course Image */}
                                <div className="relative h-40 bg-gradient-to-br from-blue-400 to-purple-600">
                                    {course.posterUrl ? (
                                        <Image
                                            src={course.posterUrl}
                                            alt={course.title}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full">
                                            <div className="text-white text-5xl">📚</div>
                                        </div>
                                    )}
                                    <div className="absolute top-3 right-3">
                                        <Badge
                                            variant="default"
                                            className="bg-green-600 text-white"
                                        >
                                            Enrolled
                                        </Badge>
                                    </div>
                                    {progressPercentage === 100 && (
                                        <div className="absolute top-3 left-3">
                                            <Badge
                                                variant="default"
                                                className="bg-yellow-600 text-white"
                                            >
                                                ✅ Completed
                                            </Badge>
                                        </div>
                                    )}
                                </div>

                                <CardHeader>
                                    <CardTitle className="text-lg line-clamp-2">
                                        {course.title}
                                    </CardTitle>
                                    <div className="flex gap-2">
                                        {course.semester && (
                                            <Badge variant="outline" className="text-xs">
                                                {course.semester}
                                            </Badge>
                                        )}
                                        <Badge variant="outline" className="text-xs">
                                            {totalLectures} Lectures
                                        </Badge>
                                    </div>
                                </CardHeader>

                                <CardContent className="space-y-4">
                                    {/* Progress */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Progress</span>
                                            <span className="font-medium">
                                                {completedLectures}/{totalLectures} lectures
                                            </span>
                                        </div>
                                        <Progress value={progressPercentage} className="h-2" />
                                        <div className="text-xs text-gray-500 text-center">
                                            {Math.round(progressPercentage)}% Complete
                                        </div>
                                    </div>

                                    {/* Teachers */}
                                    <div>
                                        <p className="text-sm font-medium text-gray-700 mb-1">Instructors:</p>
                                        {course.teachers.length === 0 ? (
                                            <p className="text-sm text-gray-500 italic">No instructors assigned</p>
                                        ) : (
                                            <div className="flex flex-wrap gap-1">
                                                {course.teachers.slice(0, 2).map((teacher) => (
                                                    <div key={teacher.id} className="flex items-center gap-1 text-xs bg-blue-50 px-2 py-1 rounded">
                                                        <span>👨‍🏫</span>
                                                        <span>{teacher.user.name || "Teacher"}</span>
                                                    </div>
                                                ))}
                                                {course.teachers.length > 2 && (
                                                    <div className="flex items-center gap-1 text-xs bg-gray-50 px-2 py-1 rounded">
                                                        +{course.teachers.length - 2} more
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Course Stats */}
                                    <div className="grid grid-cols-2 gap-2 text-center bg-gray-50 p-3 rounded-lg">
                                        <div>
                                            <div className="text-sm font-semibold text-blue-600">
                                                {completedLectures}
                                            </div>
                                            <div className="text-xs text-gray-600">Completed</div>
                                        </div>
                                        <div>
                                            <div className="text-sm font-semibold text-blue-600">
                                                {totalLectures - completedLectures}
                                            </div>
                                            <div className="text-xs text-gray-600">Remaining</div>
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    <Link href={`/profile/courses/${course.id}`} className="block">
                                        <Button className="w-full bg-blue-600 hover:bg-blue-700">
                                            {progressPercentage === 0
                                                ? "Start Learning"
                                                : progressPercentage === 100
                                                    ? "Review Course"
                                                    : "Continue Learning"
                                            }
                                        </Button>
                                    </Link>

                                    {/* Enrollment Info */}
                                    <div className="text-xs text-gray-500 text-center">
                                        Enrolled: {new Date(enrollment.enrolledAt).toLocaleDateString()}
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}

            {/* Learning Statistics */}
            {verifiedEnrollments.length > 0 && (
                <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
                    <CardHeader>
                        <CardTitle className="text-blue-800">Learning Progress Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                            <div>
                                <div className="text-2xl font-bold text-blue-600">
                                    {verifiedEnrollments.length}
                                </div>
                                <div className="text-sm text-blue-700">Active Courses</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-blue-600">
                                    {verifiedEnrollments.filter(e => {
                                        const progress = progressMap[e.courseId] || [];
                                        const total = e.course._count.lectures;
                                        return total > 0 && progress.length === total;
                                    }).length}
                                </div>
                                <div className="text-sm text-blue-700">Completed</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-blue-600">
                                    {Object.values(progressMap).reduce((sum, progress) => sum + progress.length, 0)}
                                </div>
                                <div className="text-sm text-blue-700">Lectures Watched</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-blue-600">
                                    {verifiedEnrollments.reduce((sum, e) => sum + e.course._count.lectures, 0)}
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

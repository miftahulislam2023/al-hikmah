import { getCourseById } from "@/actions/course";
import { enrollInCourse } from "@/actions/enrollment";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import prisma from "@/lib/prisma";

interface CourseEnrollPageProps {
    params: {
        courseId: string;
    };
}

export default async function CourseEnrollPage({ params }: CourseEnrollPageProps) {
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

    const courseResult = await getCourseById(params.courseId);

    if (courseResult.error || !courseResult.data) {
        return (
            <div className="container mx-auto p-6">
                <h1 className="text-2xl font-bold text-red-600 mb-4">Course Not Found</h1>
                <p className="text-red-500 mb-4">{courseResult.error || "Course not found"}</p>
                <Link href="/profile/courses/browse">
                    <Button variant="outline">← Back to Browse Courses</Button>
                </Link>
            </div>
        );
    }

    const course = courseResult.data;

    // Check if already enrolled
    const existingEnrollment = await prisma.enrollment.findUnique({
        where: {
            studentId_courseId: {
                studentId: student.id,
                courseId: course.id
            }
        }
    });

    async function handleEnrollment() {
        "use server";
        const result = await enrollInCourse(student.id, course.id);

        if (result.success) {
            if (course.price === 0) {
                // Free course - redirect to course page
                redirect(`/profile/courses/${course.id}`);
            } else {
                // Paid course - redirect to payment page
                redirect(`/profile/courses/payment/${result.data.id}`);
            }
        }
    }

    return (
        <div className="container mx-auto p-6 max-w-4xl space-y-6">
            {/* Navigation */}
            <div className="flex items-center gap-3">
                <Link href="/profile/courses/browse">
                    <Button variant="outline" size="sm">
                        ← Back to Courses
                    </Button>
                </Link>
                <div className="text-sm text-gray-600">Course Details</div>
            </div>

            {/* Course Header */}
            <Card className="overflow-hidden">
                <div className="relative h-64 bg-gradient-to-br from-blue-400 to-purple-600">
                    {course.posterUrl ? (
                        <Image
                            src={course.posterUrl}
                            alt={course.title}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-white text-8xl">📚</div>
                        </div>
                    )}
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="absolute bottom-4 left-4 right-4">
                        <h1 className="text-2xl font-bold text-white mb-2">{course.title}</h1>
                        <div className="flex gap-2">
                            <Badge variant="secondary" className="bg-white/90 text-gray-800">
                                ${course.price}
                            </Badge>
                            {course.semester && (
                                <Badge variant="secondary" className="bg-white/90 text-gray-800">
                                    {course.semester}
                                </Badge>
                            )}
                            <Badge
                                variant={course.isActive ? "default" : "secondary"}
                                className={course.isActive ? "bg-green-600" : "bg-gray-500"}
                            >
                                {course.isActive ? "Active" : "Inactive"}
                            </Badge>
                        </div>
                    </div>
                </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Description */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Course Description</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-700 leading-relaxed">
                                {course.description || "No description available for this course."}
                            </p>
                        </CardContent>
                    </Card>

                    {/* Instructors */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Instructors ({course.teachers.length})</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {course.teachers.length === 0 ? (
                                <p className="text-gray-500 italic">No instructors assigned to this course yet.</p>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {course.teachers.map((teacher) => (
                                        <div key={teacher.id} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                                            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                                                {teacher.user.name?.charAt(0) || "T"}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-800">
                                                    {teacher.user.name || "Unnamed Teacher"}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    {teacher.user.email}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Course Content */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Course Content</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-3 gap-4 text-center mb-6">
                                <div className="p-4 bg-blue-50 rounded-lg">
                                    <div className="text-2xl font-bold text-blue-600">
                                        {course._count.lectures}
                                    </div>
                                    <div className="text-sm text-blue-700">Lectures</div>
                                </div>
                                <div className="p-4 bg-green-50 rounded-lg">
                                    <div className="text-2xl font-bold text-green-600">
                                        {course._count.quizzes}
                                    </div>
                                    <div className="text-sm text-green-700">Quizzes</div>
                                </div>
                                <div className="p-4 bg-purple-50 rounded-lg">
                                    <div className="text-2xl font-bold text-purple-600">
                                        {course._count.enrollments}
                                    </div>
                                    <div className="text-sm text-purple-700">Students</div>
                                </div>
                            </div>

                            {course.lectures.length > 0 ? (
                                <div className="space-y-2">
                                    <h4 className="font-medium text-gray-700 mb-3">Preview Lectures:</h4>
                                    {course.lectures.slice(0, 5).map((lecture, index) => (
                                        <div key={lecture.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                                {index + 1}
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-800">{lecture.title}</p>
                                                {lecture.description && (
                                                    <p className="text-sm text-gray-600 line-clamp-1">
                                                        {lecture.description}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    {course.lectures.length > 5 && (
                                        <p className="text-sm text-gray-500 text-center mt-2">
                                            +{course.lectures.length - 5} more lectures
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <p className="text-gray-500 italic">Course content will be available after enrollment.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Enrollment Card */}
                    <Card className="sticky top-6">
                        <CardHeader>
                            <CardTitle className="text-center">
                                {course.price === 0 ? "Free Course" : `$${course.price}`}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {existingEnrollment ? (
                                <div className="space-y-3">
                                    <div className="text-center">
                                        <Badge
                                            variant={
                                                existingEnrollment.paymentStatus === "VERIFIED" ? "default" :
                                                    existingEnrollment.paymentStatus === "PENDING" ? "secondary" :
                                                        "destructive"
                                            }
                                            className="text-sm px-4 py-2"
                                        >
                                            {existingEnrollment.paymentStatus === "VERIFIED" ? "✅ Already Enrolled" :
                                                existingEnrollment.paymentStatus === "PENDING" ? "⏳ Payment Pending" :
                                                    "❌ Payment Rejected"}
                                        </Badge>
                                    </div>

                                    {existingEnrollment.paymentStatus === "VERIFIED" ? (
                                        <Link href={`/profile/courses/${course.id}`}>
                                            <Button className="w-full">
                                                Go to Course
                                            </Button>
                                        </Link>
                                    ) : existingEnrollment.paymentStatus === "PENDING" ? (
                                        <div className="text-center text-sm text-gray-600">
                                            Your payment is being reviewed by our admin team.
                                        </div>
                                    ) : (
                                        <form action={handleEnrollment}>
                                            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                                                Try Enrollment Again
                                            </Button>
                                        </form>
                                    )}
                                </div>
                            ) : (
                                <form action={handleEnrollment}>
                                    <Button
                                        type="submit"
                                        className="w-full bg-green-600 hover:bg-green-700"
                                        disabled={!course.isActive}
                                    >
                                        {!course.isActive
                                            ? "Course Not Available"
                                            : course.price === 0
                                                ? "Enroll for Free"
                                                : `Enroll Now - $${course.price}`
                                        }
                                    </Button>
                                </form>
                            )}

                            <div className="text-xs text-gray-500 text-center">
                                {course.price > 0 ? (
                                    "You'll be redirected to payment after enrollment"
                                ) : (
                                    "Free courses are activated immediately"
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Course Stats */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm">Course Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Students Enrolled:</span>
                                <span className="font-medium">{course._count.enrollments}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Total Lectures:</span>
                                <span className="font-medium">{course._count.lectures}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Quizzes:</span>
                                <span className="font-medium">{course._count.quizzes}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Instructors:</span>
                                <span className="font-medium">{course.teachers.length}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Created:</span>
                                <span className="font-medium">
                                    {new Date(course.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

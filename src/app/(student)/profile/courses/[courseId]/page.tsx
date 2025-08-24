import { getCourseById } from "@/actions/course";
import { getStudentProgress, markLectureComplete } from "@/actions/lecture";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import prisma from "@/lib/prisma";

interface StudentCoursePageProps {
    params: {
        courseId: string;
    };
}

export default async function StudentCoursePage({ params }: StudentCoursePageProps) {
    const session = await auth();
    if (!session || session.user?.role !== "STUDENT") {
        redirect("/signin");
    }

    const { courseId } = await params;

    // Get student ID from the database
    const student = await prisma.student.findUnique({
        where: { userId: session.user.id },
        select: { id: true }
    });

    if (!student) {
        redirect("/signin");
    }

    // Verify student is enrolled in this course
    const enrollment = await prisma.enrollment.findUnique({
        where: {
            studentId_courseId: {
                studentId: student.id,
                courseId: courseId
            },
            paymentStatus: "VERIFIED"
        }
    });

    if (!enrollment) {
        return (
            <div className="container mx-auto p-6">
                <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
                <p className="text-red-500 mb-4">
                    You are not enrolled in this course or your payment is still pending verification.
                </p>
                <div className="flex gap-3">
                    <Link href="/profile/courses">
                        <Button variant="outline">← My Courses</Button>
                    </Link>
                    <Link href="/profile/courses/browse">
                        <Button>Browse Courses</Button>
                    </Link>
                </div>
            </div>
        );
    }

    const [courseResult, progressResult] = await Promise.all([
        getCourseById(courseId),
        getStudentProgress(student.id, courseId)
    ]);

    if (courseResult.error || !courseResult.data) {
        return (
            <div className="container mx-auto p-6">
                <h1 className="text-2xl font-bold text-red-600 mb-4">Course Not Found</h1>
                <p className="text-red-500 mb-4">{courseResult.error}</p>
                <Link href="/profile/courses">
                    <Button variant="outline">← Back to My Courses</Button>
                </Link>
            </div>
        );
    }

    const course = courseResult.data;
    const studentProgress = progressResult.data || [];
    const completedLectureIds = studentProgress.map(p => p.lecture.id);

    const totalLectures = course.lectures.length;
    const completedLectures = studentProgress.length;
    const progressPercentage = totalLectures > 0 ? (completedLectures / totalLectures) * 100 : 0;

    async function handleMarkComplete(formData: FormData) {
        "use server";
        const lectureId = formData.get("lectureId") as string;
        await markLectureComplete(student.id, lectureId);
    }

    return (
        <div className="container mx-auto p-6 max-w-6xl space-y-6">
            {/* Navigation */}
            <div className="flex items-center gap-3">
                <Link href="/profile/courses">
                    <Button variant="outline" size="sm">
                        ← My Courses
                    </Button>
                </Link>
                <div className="text-sm text-gray-600">Course Learning</div>
            </div>

            {/* Course Header */}
            <Card className="overflow-hidden">
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
                    <div className="absolute inset-0 bg-black/30" />
                    <div className="absolute bottom-4 left-4 right-4">
                        <h1 className="text-2xl font-bold text-white mb-2">{course.title}</h1>
                        <div className="flex gap-2">
                            <Badge variant="default" className="bg-green-600">
                                Enrolled
                            </Badge>
                            {course.semester && (
                                <Badge variant="outline" className="bg-white/20 text-white border-white/30">
                                    {course.semester}
                                </Badge>
                            )}
                            {progressPercentage === 100 && (
                                <Badge variant="default" className="bg-yellow-600">
                                    ✅ Completed
                                </Badge>
                            )}
                        </div>
                    </div>
                </div>
                <CardContent className="p-6">
                    {/* Progress Section */}
                    <div className="space-y-3 mb-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold">Course Progress</h3>
                            <span className="text-sm font-medium">
                                {completedLectures}/{totalLectures} lectures completed
                            </span>
                        </div>
                        <Progress value={progressPercentage} className="h-3" />
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>{Math.round(progressPercentage)}% Complete</span>
                            <span>
                                {totalLectures - completedLectures} lectures remaining
                            </span>
                        </div>
                    </div>

                    {/* Course Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div className="p-3 bg-blue-50 rounded-lg">
                            <div className="text-xl font-bold text-blue-600">{completedLectures}</div>
                            <div className="text-sm text-blue-700">Completed</div>
                        </div>
                        <div className="p-3 bg-green-50 rounded-lg">
                            <div className="text-xl font-bold text-green-600">{totalLectures}</div>
                            <div className="text-sm text-green-700">Total Lectures</div>
                        </div>
                        <div className="p-3 bg-purple-50 rounded-lg">
                            <div className="text-xl font-bold text-purple-600">{course.teachers.length}</div>
                            <div className="text-sm text-purple-700">Instructors</div>
                        </div>
                        <div className="p-3 bg-yellow-50 rounded-lg">
                            <div className="text-xl font-bold text-yellow-600">{course._count.quizzes}</div>
                            <div className="text-sm text-yellow-700">Quizzes</div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Main Content - Lectures */}
                <div className="lg:col-span-3 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Course Content</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {course.lectures.length === 0 ? (
                                <div className="text-center py-8">
                                    <div className="text-gray-400 text-4xl mb-3">📚</div>
                                    <h3 className="text-lg font-medium text-gray-700 mb-2">No Lectures Available</h3>
                                    <p className="text-gray-500">Course content is being prepared by your instructors.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {course.lectures
                                        .sort((a, b) => a.order - b.order)
                                        .map((lecture, index) => {
                                            const isCompleted = completedLectureIds.includes(lecture.id);

                                            return (
                                                <div
                                                    key={lecture.id}
                                                    className={`border rounded-lg p-4 transition-all ${isCompleted
                                                            ? 'border-green-200 bg-green-50'
                                                            : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                                                        }`}
                                                >
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-3 mb-2">
                                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${isCompleted ? 'bg-green-600' : 'bg-blue-600'
                                                                    }`}>
                                                                    {isCompleted ? '✓' : lecture.order || index + 1}
                                                                </div>
                                                                <h4 className="font-semibold text-lg text-gray-800">
                                                                    {lecture.title}
                                                                </h4>
                                                                {isCompleted && (
                                                                    <Badge variant="default" className="bg-green-600">
                                                                        Completed
                                                                    </Badge>
                                                                )}
                                                            </div>

                                                            {lecture.description && (
                                                                <p className="text-gray-600 mb-3 ml-11">{lecture.description}</p>
                                                            )}

                                                            <div className="flex gap-3 ml-11">
                                                                {lecture.videoUrl && (
                                                                    <a
                                                                        href={lecture.videoUrl}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
                                                                    >
                                                                        <span>🎥</span>
                                                                        <span>Watch Video</span>
                                                                    </a>
                                                                )}
                                                                {lecture.documentUrl && (
                                                                    <a
                                                                        href={lecture.documentUrl}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
                                                                    >
                                                                        <span>📄</span>
                                                                        <span>View Document</span>
                                                                    </a>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div className="ml-4">
                                                            {!isCompleted ? (
                                                                <form action={handleMarkComplete}>
                                                                    <input type="hidden" name="lectureId" value={lecture.id} />
                                                                    <Button
                                                                        type="submit"
                                                                        size="sm"
                                                                        className="bg-green-600 hover:bg-green-700"
                                                                    >
                                                                        Mark Complete
                                                                    </Button>
                                                                </form>
                                                            ) : (
                                                                <div className="text-green-600 text-sm flex items-center gap-1">
                                                                    <span>✅</span>
                                                                    <span>Completed</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Course Description */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm">About This Course</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-700">
                                {course.description || "No description available for this course."}
                            </p>
                        </CardContent>
                    </Card>

                    {/* Instructors */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm">Your Instructors</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {course.teachers.length === 0 ? (
                                <p className="text-sm text-gray-500 italic">No instructors assigned</p>
                            ) : (
                                <div className="space-y-3">
                                    {course.teachers.map((teacher) => (
                                        <div key={teacher.id} className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                                                {teacher.user.name?.charAt(0) || "T"}
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm">
                                                    {teacher.user.name || "Unnamed Teacher"}
                                                </p>
                                                <p className="text-xs text-gray-600">
                                                    {teacher.user.email}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Course Stats */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm">Course Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Enrolled:</span>
                                <span className="font-medium">
                                    {new Date(enrollment.enrolledAt).toLocaleDateString()}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Progress:</span>
                                <span className="font-medium">{Math.round(progressPercentage)}%</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Total Students:</span>
                                <span className="font-medium">{course._count.enrollments}</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm">Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Link href="/profile/courses" className="block">
                                <Button variant="outline" size="sm" className="w-full">
                                    Back to My Courses
                                </Button>
                            </Link>
                            <Link href="/profile/courses/browse" className="block">
                                <Button variant="outline" size="sm" className="w-full">
                                    Browse More Courses
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
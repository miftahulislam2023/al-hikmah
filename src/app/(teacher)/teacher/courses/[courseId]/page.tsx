import { getCourseById } from "@/actions/course";
import { createLecture, getLecturesByCourse } from "@/actions/lecture";
import { auth } from "@/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { redirect } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/prisma";
import DeleteLectureButton from "@/components/teacher/DeleteLectureButton";

interface TeacherCoursePageProps {
    params: {
        courseId: string;
    };
}

export default async function TeacherCoursePage({ params }: TeacherCoursePageProps) {
    const session = await auth();
    if (!session || session.user?.role !== "TEACHER") {
        redirect("/signin");
    }

    const { courseId } = await params;

    // Get the teacher from the database
    const teacher = await prisma.teacher.findUnique({
        where: { userId: session.user.id },
        select: { id: true }
    });

    if (!teacher) {
        redirect("/signin");
    }

    // Verify teacher has access to this course
    const hasAccess = await prisma.course.findFirst({
        where: {
            id: courseId,
            teachers: {
                some: {
                    id: teacher.id
                }
            }
        }
    });

    if (!hasAccess) {
        return (
            <div className="container mx-auto p-6">
                <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
                <p className="text-red-500 mb-4">You don&apos;t have access to this course.</p>
                <Link
                    href="/teacher/courses"
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium px-4 py-2 h-9 border border-gray-300 bg-white hover:bg-gray-50 transition-colors"
                >
                    ← Back to My Courses
                </Link>
            </div>
        );
    }

    const [courseResult, lecturesResult] = await Promise.all([
        getCourseById(courseId),
        getLecturesByCourse(courseId)
    ]);

    if (courseResult.error || !courseResult.data) {
        return (
            <div className="container mx-auto p-6">
                <h1 className="text-2xl font-bold text-red-600 mb-4">Course Not Found</h1>
                <p className="text-red-500 mb-4">{courseResult.error}</p>
                <Link
                    href="/teacher/courses"
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium px-4 py-2 h-9 border border-gray-300 bg-white hover:bg-gray-50 transition-colors"
                >
                    ← Back to My Courses
                </Link>
            </div>
        );
    }

    const course = courseResult.data;
    const lectures = lecturesResult.data || [];

    async function handleAddLecture(formData: FormData) {
        "use server";
        formData.append("courseId", courseId);
        await createLecture(formData);
    }

    return (
        <div className="container mx-auto p-6 max-w-6xl space-y-6">
            {/* Navigation */}
            <div className="flex items-center gap-3">
                <Link
                    href="/teacher/courses"
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium px-3 py-2 h-8 border border-gray-300 bg-white hover:bg-gray-50 transition-colors"
                >
                    ← My Courses
                </Link>
                <div className="text-sm text-gray-600">Course Management</div>
            </div>

            {/* Course Header */}
            <Card className="overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold mb-2">{course.title}</h1>
                            <p className="text-blue-100 mb-3">{course.description}</p>
                            <div className="flex gap-2">
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
                                <Badge variant="outline" className="bg-white/20 text-white border-white/30">
                                    ${course.price}
                                </Badge>
                            </div>
                        </div>
                    </div>
                </div>
                <CardContent className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div>
                            <div className="text-2xl font-bold text-blue-600">
                                {course._count.enrollments}
                            </div>
                            <div className="text-sm text-gray-600">Enrolled Students</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-blue-600">
                                {lectures.length}
                            </div>
                            <div className="text-sm text-gray-600">Total Lectures</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-blue-600">
                                {course._count.quizzes}
                            </div>
                            <div className="text-sm text-gray-600">Quizzes</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-blue-600">
                                {course.teachers.length}
                            </div>
                            <div className="text-sm text-gray-600">Co-Teachers</div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content - Lectures */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Add New Lecture */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Add New Lecture</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form action={handleAddLecture} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="title">Lecture Title *</Label>
                                        <Input
                                            id="title"
                                            name="title"
                                            placeholder="Introduction to..."
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="order">Order (Position)</Label>
                                        <Input
                                            id="order"
                                            name="order"
                                            type="number"
                                            placeholder="1"
                                            defaultValue={lectures.length + 1}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        name="description"
                                        placeholder="Brief description of what this lecture covers..."
                                        rows={3}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="videoUrl">Video URL (Optional)</Label>
                                        <Input
                                            id="videoUrl"
                                            name="videoUrl"
                                            type="url"
                                            placeholder="https://youtube.com/watch?v=..."
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="documentUrl">Document URL (Optional)</Label>
                                        <Input
                                            id="documentUrl"
                                            name="documentUrl"
                                            type="url"
                                            placeholder="https://drive.google.com/..."
                                        />
                                    </div>
                                </div>

                                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                                    Add Lecture
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Lectures List */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Course Lectures ({lectures.length})</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {lectures.length === 0 ? (
                                <div className="text-center py-8">
                                    <div className="text-gray-400 text-4xl mb-3">📚</div>
                                    <h3 className="text-lg font-medium text-gray-700 mb-2">No Lectures Yet</h3>
                                    <p className="text-gray-500">Add your first lecture using the form above.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {lectures
                                        .sort((a, b) => a.order - b.order)
                                        .map((lecture, index) => (
                                            <div
                                                key={lecture.id}
                                                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                                                {lecture.order || index + 1}
                                                            </div>
                                                            <h4 className="font-semibold text-lg text-gray-800">
                                                                {lecture.title}
                                                            </h4>
                                                            <Badge variant={lecture.isActive ? "default" : "secondary"}>
                                                                {lecture.isActive ? "Active" : "Draft"}
                                                            </Badge>
                                                        </div>

                                                        {lecture.description && (
                                                            <p className="text-gray-600 mb-3">{lecture.description}</p>
                                                        )}

                                                        <div className="flex gap-4 text-sm text-gray-500">
                                                            {lecture.videoUrl && (
                                                                <div className="flex items-center gap-1">
                                                                    <span>🎥</span>
                                                                    <span>Video</span>
                                                                </div>
                                                            )}
                                                            {lecture.documentUrl && (
                                                                <div className="flex items-center gap-1">
                                                                    <span>📄</span>
                                                                    <span>Document</span>
                                                                </div>
                                                            )}
                                                            <div>
                                                                Created: {new Date(lecture.createdAt).toLocaleDateString()}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex gap-2 ml-4">
                                                        <Link
                                                            href={`/teacher/courses/${courseId}/${lecture.id}`}
                                                            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium px-3 py-2 h-8 border border-gray-300 bg-white hover:bg-gray-50 transition-colors"
                                                        >
                                                            Edit
                                                        </Link>
                                                        <DeleteLectureButton
                                                            lectureId={lecture.id}
                                                            lectureTitle={lecture.title}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Course Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm">Course Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Price:</span>
                                <span className="font-medium">${course.price}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Status:</span>
                                <Badge variant={course.isActive ? "default" : "secondary"}>
                                    {course.isActive ? "Active" : "Inactive"}
                                </Badge>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Created:</span>
                                <span className="font-medium">
                                    {new Date(course.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Co-Teachers */}
                    {course.teachers.length > 1 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm">Co-Teachers</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {course.teachers
                                        .filter(t => t.userId !== session.user.id)
                                        .map((teacher) => (
                                            <div key={teacher.id} className="flex items-center gap-2 text-sm">
                                                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs">
                                                    {teacher.user.name?.charAt(0) || "T"}
                                                </div>
                                                <span>{teacher.user.name || "Unnamed Teacher"}</span>
                                            </div>
                                        ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Enrolled Students */}
                    {course.enrollments.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm">Recent Students</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {course.enrollments
                                        .filter(e => e.paymentStatus === "VERIFIED")
                                        .slice(0, 5)
                                        .map((enrollment) => (
                                            <div key={enrollment.id} className="flex items-center gap-2 text-sm">
                                                <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-white text-xs">
                                                    {enrollment.student.user.name?.charAt(0) || "S"}
                                                </div>
                                                <span>{enrollment.student.user.name || "Student"}</span>
                                            </div>
                                        ))}
                                    {course.enrollments.filter(e => e.paymentStatus === "VERIFIED").length > 5 && (
                                        <div className="text-xs text-gray-500 text-center">
                                            +{course.enrollments.filter(e => e.paymentStatus === "VERIFIED").length - 5} more
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
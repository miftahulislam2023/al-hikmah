import { getCoursesWithTeachers, assignTeacherToCourse } from "@/actions/course";
import { getAllTeachers } from "@/actions/user";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import RemoveTeacherButton from "@/components/admin/RemoveTeacherButton";

export default async function CourseAssignmentPage() {
    const session = await auth();
    if (!session || session.user?.role !== "ADMIN") {
        redirect("/signin");
    }

    const [coursesResult, teachersResult] = await Promise.all([
        getCoursesWithTeachers(),
        getAllTeachers()
    ]);

    if (coursesResult.error || teachersResult.error) {
        return (
            <div className="container mx-auto p-6">
                <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
                <p className="text-red-500">{coursesResult.error || teachersResult.error}</p>
            </div>
        );
    }

    const courses = coursesResult.data || [];
    const teachers = teachersResult.data || [];

    async function handleAssignTeacher(formData: FormData) {
        "use server";
        await assignTeacherToCourse(formData);
    }

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Course-Teacher Assignment</h1>
                    <p className="text-gray-600">Manage teacher assignments for all courses</p>
                </div>
                <div className="flex gap-3">
                    <Badge variant="secondary" className="text-lg px-3 py-1">
                        {courses.length} Courses
                    </Badge>
                    <Badge variant="outline" className="text-lg px-3 py-1">
                        {teachers.length} Teachers
                    </Badge>
                    <Link
                        href="/admin/courses"
                        className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium px-4 py-2 h-9 border border-gray-300 bg-white hover:bg-gray-50 transition-colors"
                    >
                        View All Courses
                    </Link>
                </div>
            </div>

            {courses.length === 0 ? (
                <Card>
                    <CardContent className="text-center py-12">
                        <div className="text-gray-400 text-6xl mb-4">📚</div>
                        <h3 className="text-xl font-medium text-gray-700 mb-2">No Courses Found</h3>
                        <p className="text-gray-500 mb-6">Create some courses first to assign teachers.</p>
                        <Link
                            href="/admin/courses/create"
                            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                        >
                            Create First Course
                        </Link>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-6">
                    {courses.map((course) => (
                        <Card key={course.id} className="border-l-4 border-l-blue-400">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-xl">
                                            {course.title}
                                        </CardTitle>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {course.description || "No description"}
                                        </p>
                                        <div className="flex gap-2 mt-2">
                                            <Badge variant={course.isActive ? "default" : "secondary"}>
                                                {course.isActive ? "Active" : "Inactive"}
                                            </Badge>
                                            {course.semester && (
                                                <Badge variant="outline">
                                                    {course.semester}
                                                </Badge>
                                            )}
                                            <Badge variant="outline">
                                                ${course.price}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Current Teachers */}
                                <div>
                                    <h4 className="font-medium text-gray-700 mb-3">
                                        Assigned Teachers ({course.teachers.length})
                                    </h4>
                                    {course.teachers.length === 0 ? (
                                        <div className="text-gray-500 italic bg-gray-50 p-4 rounded-lg">
                                            No teachers assigned to this course
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {course.teachers.map((teacher) => (
                                                <div
                                                    key={teacher.id}
                                                    className="flex items-center justify-between bg-green-50 p-3 rounded-lg border border-green-200"
                                                >
                                                    <div>
                                                        <p className="font-medium text-green-800">
                                                            {teacher.user.name || "Unnamed Teacher"}
                                                        </p>
                                                        <p className="text-sm text-green-600">
                                                            {teacher.user.email}
                                                        </p>
                                                    </div>
                                                    <RemoveTeacherButton
                                                        courseId={course.id}
                                                        teacherId={teacher.id}
                                                        teacherName={teacher.user.name || "Unnamed Teacher"}
                                                        courseName={course.title}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Add Teacher */}
                                <div className="border-t pt-4">
                                    <h4 className="font-medium text-gray-700 mb-3">Assign New Teacher</h4>
                                    {teachers.length === 0 ? (
                                        <div className="text-gray-500 italic bg-gray-50 p-4 rounded-lg">
                                            No teachers available.
                                            <Link href="/admin/teachers/register" className="text-blue-600 hover:underline ml-1">
                                                Register a teacher first.
                                            </Link>
                                        </div>
                                    ) : (
                                        <form action={handleAssignTeacher} className="flex gap-3">
                                            <input type="hidden" name="courseId" value={course.id} />
                                            <Select name="teacherId" required>
                                                <SelectTrigger className="flex-1">
                                                    <SelectValue placeholder="Select a teacher to assign" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {teachers
                                                        .filter(teacher =>
                                                            !course.teachers.some(ct => ct.id === teacher.id)
                                                        )
                                                        .map((teacher) => (
                                                            <SelectItem key={teacher.id} value={teacher.id}>
                                                                {teacher.user.name || "Unnamed"} - {teacher.user.email}
                                                            </SelectItem>
                                                        ))}
                                                </SelectContent>
                                            </Select>
                                            <Button
                                                type="submit"
                                                className="bg-green-600 hover:bg-green-700"
                                                disabled={teachers.filter(teacher =>
                                                    !course.teachers.some(ct => ct.id === teacher.id)
                                                ).length === 0}
                                            >
                                                Assign Teacher
                                            </Button>
                                        </form>
                                    )}
                                </div>

                                {/* Course Stats */}
                                <div className="border-t pt-4">
                                    <div className="grid grid-cols-3 gap-4 text-center">
                                        <div>
                                            <div className="text-lg font-semibold text-blue-600">
                                                {course._count.enrollments}
                                            </div>
                                            <div className="text-sm text-gray-600">Students</div>
                                        </div>
                                        <div>
                                            <div className="text-lg font-semibold text-blue-600">
                                                {course._count.lectures}
                                            </div>
                                            <div className="text-sm text-gray-600">Lectures</div>
                                        </div>
                                        <div>
                                            <div className="text-lg font-semibold text-blue-600">
                                                {course.teachers.length}
                                            </div>
                                            <div className="text-sm text-gray-600">Teachers</div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Summary Statistics */}
            {courses.length > 0 && (
                <Card className="bg-blue-50 border-blue-200">
                    <CardHeader>
                        <CardTitle className="text-blue-800">Assignment Summary</CardTitle>
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
                                    {courses.filter(c => c.teachers.length > 0).length}
                                </div>
                                <div className="text-sm text-blue-700">Courses with Teachers</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-blue-600">
                                    {courses.filter(c => c.teachers.length === 0).length}
                                </div>
                                <div className="text-sm text-blue-700">Unassigned Courses</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-blue-600">
                                    {courses.reduce((sum, c) => sum + c.teachers.length, 0)}
                                </div>
                                <div className="text-sm text-blue-700">Total Assignments</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

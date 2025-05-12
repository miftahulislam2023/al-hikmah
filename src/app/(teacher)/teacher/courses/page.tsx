import { getCurrentTeacher } from "@/actions/teacher";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { formatDate } from "@/lib/utils";

export default async function TeacherCoursesPage() {
    const session = await auth();
    if (!session) redirect("/signin");

    const { data: teacher, error } = await getCurrentTeacher();

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[80vh]">
                <Card className="w-full max-w-md shadow-lg">
                    <CardHeader className="bg-red-50 border-b">
                        <CardTitle className="text-red-700">Error</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                        <p className="text-red-600">{error}</p>
                        <Link
                            href="/signin"
                            className="mt-3 inline-flex px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                        >
                            Sign In
                        </Link>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const courses = teacher?.courses || [];

    return (
        <div className="container mx-auto p-4 max-w-5xl">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">My Courses</h1>
            {courses.length === 0 ? (
                <Card className="bg-gray-50">
                    <CardContent className="p-8 text-center">
                        <div className="text-gray-400 text-5xl mb-4">📚</div>
                        <h3 className="text-xl font-medium text-gray-700">No Courses Assigned</h3>
                        <p className="text-gray-500 mt-2">You don&apos;t have any courses assigned yet.</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course) => (
                        <Link key={course.id} href={`/teacher/courses/${course.id}`} className="group">
                            <Card className="hover:shadow-lg transition-shadow border-0">
                                <CardHeader className="bg-blue-600 text-white rounded-t-xl p-4">
                                    <CardTitle className="text-lg group-hover:underline">{course.title}</CardTitle>
                                </CardHeader>
                                <CardContent className="p-4 space-y-2">
                                    <div className="flex items-center gap-2">
                                        <span className={`inline-block px-2 py-1 text-xs rounded-full font-medium ${course.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{course.isActive ? 'Active' : 'Inactive'}</span>
                                        <span className="text-xs text-gray-500">Semester: {course.semester}</span>
                                    </div>
                                    <div className="text-gray-700 font-medium">৳ {course.fee}</div>
                                    <div className="text-xs text-gray-400">Created: {formatDate(course.createdAt)}</div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}

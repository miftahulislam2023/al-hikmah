import { auth } from "@/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function TeacherPage() {
    const session = await auth();

    if (!session || session.user?.role !== "TEACHER") {
        redirect("/signin");
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Teacher Dashboard</h1>
            <p className="text-gray-600 mb-8">Welcome back, {session.user?.name || session.user?.email}!</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>My Courses</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-600 mb-4">Manage your teaching courses</p>
                        <Link
                            href="/teacher/courses"
                            className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            View Courses
                        </Link>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Profile</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-600 mb-4">Update your profile information</p>
                        <Link
                            href="/teacher/profile/edit"
                            className="inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                            Edit Profile
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

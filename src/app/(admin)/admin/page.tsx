import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { getAllStudents, getAllTeachers } from "@/actions/user";
import { getAllCourses } from "@/actions/course";
import { getPendingPayments } from "@/actions/enrollment";
import Link from "next/link";

export default async function AdminHome() {
    // Fetch dashboard data
    const [studentsResult, teachersResult, coursesResult, paymentsResult] = await Promise.all([
        getAllStudents(),
        getAllTeachers(),
        getAllCourses(),
        getPendingPayments()
    ]);

    const studentsCount = studentsResult.data?.length || 0;
    const teachersCount = teachersResult.data?.length || 0;
    const coursesCount = coursesResult.data?.length || 0;
    const pendingPaymentsCount = paymentsResult.data?.length || 0;

    return (
        <div className="container mx-auto p-6 space-y-8">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
                <p className="text-gray-600">Manage your LMS efficiently</p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-blue-50 border-blue-200">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-blue-800">Total Students</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-blue-600">{studentsCount}</div>
                    </CardContent>
                </Card>

                <Card className="bg-green-50 border-green-200">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-green-800">Total Teachers</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-green-600">{teachersCount}</div>
                    </CardContent>
                </Card>

                <Card className="bg-purple-50 border-purple-200">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-purple-800">Total Courses</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-purple-600">{coursesCount}</div>
                    </CardContent>
                </Card>

                <Card className="bg-orange-50 border-orange-200">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-orange-800">Pending Payments</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-orange-600">{pendingPaymentsCount}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <CardTitle className="text-blue-700">Student Management</CardTitle>
                        <CardDescription>Register new students and manage existing ones</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <Link
                            href="/admin/students/register"
                            className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                        >
                            Register New Student
                        </Link>
                        <Link
                            href="/admin/students/search"
                            className="block w-full text-center px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 transition-colors"
                        >
                            Search Students
                        </Link>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <CardTitle className="text-green-700">Course Management</CardTitle>
                        <CardDescription>Create and manage courses</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <Link
                            href="/admin/courses/create"
                            className="block w-full text-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                        >
                            Create New Course
                        </Link>
                        <Link
                            href="/admin/courses"
                            className="block w-full text-center px-4 py-2 border border-green-600 text-green-600 rounded hover:bg-green-50 transition-colors"
                        >
                            View All Courses
                        </Link>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <CardTitle className="text-orange-700">Payment Management</CardTitle>
                        <CardDescription>Verify student payments and manage transactions</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <Link
                            href="/admin/payment"
                            className="block w-full text-center px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors"
                        >
                            Verify Payments
                        </Link>
                        <div className="text-sm text-gray-600 text-center">
                            {pendingPaymentsCount} payments pending
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activity */}
            <Card>
                <CardHeader>
                    <CardTitle>System Overview</CardTitle>
                    <CardDescription>Quick overview of your LMS</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-sm text-gray-600 space-y-2">
                        <p>• Total registered students: <strong>{studentsCount}</strong></p>
                        <p>• Active teachers: <strong>{teachersCount}</strong></p>
                        <p>• Available courses: <strong>{coursesCount}</strong></p>
                        <p>• Payments awaiting verification: <strong>{pendingPaymentsCount}</strong></p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
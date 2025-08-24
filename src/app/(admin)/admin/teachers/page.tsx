import { getAllTeachers } from "@/actions/user";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import DeleteTeacherButton from "@/components/admin/DeleteTeacherButton";

export default async function TeachersManagementPage() {
    const session = await auth();
    if (!session || session.user?.role !== "ADMIN") {
        redirect("/signin");
    }

    const { data: teachers, error } = await getAllTeachers();

    if (error) {
        return (
            <div className="container mx-auto p-6">
                <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Teacher Management</h1>
                    <p className="text-gray-600">Manage all teachers in the system</p>
                </div>
                <div className="flex gap-3">
                    <Badge variant="secondary" className="text-lg px-3 py-1">
                        {teachers?.length || 0} Teachers
                    </Badge>
                    <Link
                        href="/admin/teachers/register"
                        className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium px-4 py-2 bg-green-600 text-white hover:bg-green-700 transition-colors"
                    >
                        + Register New Teacher
                    </Link>
                </div>
            </div>

            {!teachers || teachers.length === 0 ? (
                <Card>
                    <CardContent className="text-center py-12">
                        <div className="text-gray-400 text-6xl mb-4">👩‍🏫</div>
                        <h3 className="text-xl font-medium text-gray-700 mb-2">No Teachers Found</h3>
                        <p className="text-gray-500 mb-6">Get started by registering your first teacher.</p>
                        <Link
                            href="/admin/teachers/register"
                            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium px-4 py-2 bg-green-600 text-white hover:bg-green-700 transition-colors"
                        >
                            Register First Teacher
                        </Link>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {teachers.map((teacher) => (
                        <Card key={teacher.id} className="border-l-4 border-l-blue-400">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-lg">
                                            {teacher.user.name || "Unnamed Teacher"}
                                        </CardTitle>
                                        <p className="text-sm text-gray-600">{teacher.user.email}</p>
                                    </div>
                                    <Badge variant="outline" className="text-blue-600 border-blue-600">
                                        Teacher
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="font-medium text-gray-700">Phone:</span>
                                        <p className="text-gray-600">{teacher.user.phone || "Not provided"}</p>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-700">Experience:</span>
                                        <p className="text-gray-600">
                                            {teacher.experience ? `${teacher.experience} years` : "Not specified"}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-700">Gender:</span>
                                        <p className="text-gray-600">{teacher.gender || "Not specified"}</p>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-700">Institute:</span>
                                        <p className="text-gray-600">{teacher.currentInstitute || "Not specified"}</p>
                                    </div>
                                </div>

                                {teacher.specialization && (
                                    <div>
                                        <span className="font-medium text-gray-700">Specialization:</span>
                                        <p className="text-gray-600 text-sm mt-1">{teacher.specialization}</p>
                                    </div>
                                )}

                                {teacher.address && (
                                    <div>
                                        <span className="font-medium text-gray-700">Address:</span>
                                        <p className="text-gray-600 text-sm mt-1">{teacher.address}</p>
                                    </div>
                                )}

                                <div className="pt-4 border-t">
                                    <div className="flex justify-between items-center">
                                        <div className="text-sm text-gray-500">
                                            Registered: {new Date(teacher.user.createdAt).toLocaleDateString()}
                                        </div>
                                        <div className="flex gap-2">
                                            <Link
                                                href={`/admin/teachers/${encodeURIComponent(teacher.user.email)}`}
                                                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium px-3 py-2 h-8 border border-gray-300 bg-white hover:bg-gray-50 transition-colors"
                                            >
                                                Edit
                                            </Link>
                                            <DeleteTeacherButton
                                                teacherId={teacher.id}
                                                teacherName={teacher.user.name || "Teacher"}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Quick Stats */}
            {teachers && teachers.length > 0 && (
                <Card className="bg-blue-50 border-blue-200">
                    <CardHeader>
                        <CardTitle className="text-blue-800">Quick Statistics</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                            <div>
                                <div className="text-2xl font-bold text-blue-600">
                                    {teachers.length}
                                </div>
                                <div className="text-sm text-blue-700">Total Teachers</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-blue-600">
                                    {teachers.filter(t => t.experience && t.experience > 5).length}
                                </div>
                                <div className="text-sm text-blue-700">Experienced (5+ years)</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-blue-600">
                                    {teachers.filter(t => t.specialization).length}
                                </div>
                                <div className="text-sm text-blue-700">With Specialization</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-blue-600">
                                    {teachers.filter(t => t.user.phone).length}
                                </div>
                                <div className="text-sm text-blue-700">With Phone Number</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

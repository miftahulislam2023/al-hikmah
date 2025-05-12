import { getCurrentTeacher } from "@/actions/teacher";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/auth";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";

export default async function TeacherPage() {
    const session = await auth();

    // Redirect if not logged in
    if (!session) {
        redirect('/signin');
    }

    const { data: teacher, error } = await getCurrentTeacher();

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[80vh]">
                <Card className="w-full max-w-3xl">
                    <CardHeader className="bg-red-50 border-b">
                        <CardTitle className="text-red-700">Error</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <p className="text-red-600">{error}</p>
                        <Link
                            href="/signin"
                            className="mt-4 inline-block px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                        >
                            Sign In
                        </Link>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Teacher Dashboard</h1>
                <p className="text-gray-600">Welcome back, {teacher?.name || session.user?.email}!</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Teacher Profile Card */}
                <div className="md:col-span-2">
                    <Card className="overflow-hidden border-none shadow-lg">
                        <CardHeader className="bg-gray-950 text-white p-4 rounded-2xl">
                            <CardTitle className="text-2xl">Personal Information</CardTitle>
                            <CardDescription className="text-indigo-100">Your profile details</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <ProfileItem label="Name" value={teacher?.name || "Not provided"} />
                                    <ProfileItem label="Email" value={teacher?.email} />
                                    <ProfileItem label="Phone" value={teacher?.phone || "Not provided"} />
                                    <ProfileItem label="Gender" value={teacher?.gender ? capitalize(teacher.gender) : "Not provided"} />
                                </div>
                                <div className="space-y-4">
                                    <ProfileItem label="Date of Birth" value={teacher?.dob ? formatDate(teacher.dob) : "Not provided"} />
                                    <ProfileItem label="Address" value={teacher?.address || "Not provided"} />
                                    <ProfileItem label="Institution" value={teacher?.currentInstitute || "Not provided"} />
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end">
                                <Link
                                    href="/teacher/profile/edit"
                                >
                                    <Button variant="outline">
                                        Edit Profile
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Stats Card */}
                <div>
                    <Card className="border-none shadow-lg h-full">
                        <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-4 rounded-2xl">
                            <CardTitle className="text-2xl">Summary</CardTitle>
                            <CardDescription className="text-emerald-100">Your teaching stats</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="space-y-6">
                                <StatItem
                                    label="Courses"
                                    value={teacher?.courses?.length || 0}
                                    description="Total courses assigned"
                                />
                                <StatItem
                                    label="Active Courses"
                                    value={teacher?.courses?.filter(c => c.isActive).length || 0}
                                    description="Currently active courses"
                                />

                                <div className="pt-4 mt-6 border-t">
                                    <Link
                                        href="/teacher/courses"
                                        className="flex items-center justify-center w-full px-4 py-3 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
                                    >
                                        View All Courses
                                    </Link>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Recent Courses */}
            {teacher?.courses && teacher.courses.length > 0 ? (
                <div className="mt-8">
                    <Card className="border-none shadow-lg">
                        <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                            <CardTitle className="text-2xl">Your Courses</CardTitle>
                            <CardDescription className="text-blue-100">Courses you are teaching</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {teacher.courses.slice(0, 3).map((course) => (
                                    <Link
                                        key={course.id}
                                        href={`/teacher/courses/${course.id}`}
                                        className="block"
                                    >
                                        <div className="border rounded-lg p-4 hover:shadow-md transition-shadow hover:border-indigo-300 h-full">
                                            <div className={`text-xs font-medium px-2 py-1 rounded-full inline-block mb-2 ${course.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                }`}>
                                                {course.isActive ? 'Active' : 'Inactive'}
                                            </div>
                                            <h3 className="font-medium text-gray-900 text-lg">{course.title}</h3>
                                            <p className="text-gray-500 text-sm mt-1">Semester: {course.semester}</p>
                                            <p className="text-gray-600 font-medium mt-2">৳ {course.fee}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>

                            {teacher.courses.length > 3 && (
                                <div className="mt-4 text-center">
                                    <Link
                                        href="/teacher/courses"
                                        className="text-indigo-600 hover:text-indigo-800 font-medium"
                                    >
                                        View all {teacher.courses.length} courses →
                                    </Link>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            ) : (
                <div className="mt-8">
                    <Card className="border-none shadow-lg bg-gray-50">
                        <CardContent className="p-8 text-center">
                            <div className="text-gray-400 text-5xl mb-4">📚</div>
                            <h3 className="text-xl font-medium text-gray-700">No Courses Assigned</h3>
                            <p className="text-gray-500 mt-2">You don&apos;t have any courses assigned yet.</p>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}

// Helper components
function ProfileItem({ label, value }: { label: string; value: string | null | undefined }) {
    return (
        <div>
            <p className="text-sm font-medium text-gray-500">{label}</p>
            <p className="text-gray-800">{value || "Not provided"}</p>
        </div>
    );
}

function StatItem({ label, value, description }: { label: string; value: number; description: string }) {
    return (
        <div>
            <div className="flex justify-between items-center mb-1">
                <span className="text-gray-600 font-medium">{label}</span>
                <span className="text-2xl font-bold text-gray-800">{value}</span>
            </div>
            <p className="text-sm text-gray-500">{description}</p>
        </div>
    );
}

// Helper functions
function capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function ViewCourses() {
    const courses = await prisma.course.findMany({});
    return (
        <div className="min-h-screen bg-gray-100 px-6 py-20">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-5xl font-bold text-center mb-16 leading-tight">
                    Explore Our Courses
                </h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                    {courses.map((course) => (
                        <Card
                            key={course.id}
                            className="rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow bg-white"
                        >
                            <CardHeader className="p-6 border-b border-gray-100 rounded-t-2xl">
                                <CardTitle className="text-2xl font-semibold text-gray-800">
                                    {course.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-6">
                                <div className="space-y-3 text-base text-gray-700">
                                    <div className="flex justify-between">
                                        <span className="font-medium text-gray-600">Semester:</span>
                                        <span>{course.semester}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-medium text-gray-600">Fee:</span>
                                        <span>৳ {course.price}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-medium text-gray-600">Status:</span>
                                        <span className={course.isActive ? "text-green-600 font-semibold" : "text-red-500 font-semibold"}>
                                            {course.isActive ? "Active" : "Inactive"}
                                        </span>
                                    </div>
                                </div>
                                <Link href={`/admin/courses/${course.id}`}>
                                    <Button className="w-full">View Course</Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}

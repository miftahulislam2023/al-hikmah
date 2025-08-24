import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

export default async function Dashboard({ params }: { params: { courseId: string } }) {
    const { courseId } = await params;
    const course = await prisma.course.findUnique({
        where: { id: courseId },
        include: { lectures: true },
    });

    return (
        <div className="max-w-3xl mx-auto p-4 space-y-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Course Dashboard</h1>
            <p className="mb-6">Course: <span className="font-semibold">{course?.title || courseId}</span></p>

            <Card>
                <CardHeader>
                    <CardTitle>Lectures</CardTitle>
                </CardHeader>
                <CardContent>
                    {course?.lectures && course.lectures.length > 0 ? (
                        <ul className="space-y-4">
                            {course.lectures.map((lecture) => (
                                <li key={lecture.id} className="border rounded p-4">
                                    <div className="font-semibold text-lg">{lecture.title}</div>
                                    <div className="text-gray-600 mb-2">{lecture.description}</div>
                                    <div className="text-xs text-gray-400">Created: {formatDate(lecture.createdAt)}</div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="text-gray-500">No lectures for this course yet.</div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
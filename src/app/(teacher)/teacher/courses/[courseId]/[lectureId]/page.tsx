import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function LectureDetailPage({ params }: { params: { courseId: string; lectureId: string } }) {
    const session = await auth();
    if (!session) redirect("/signin");

    const { courseId, lectureId } = await params;

    // Fetch the lecture
    const lecture = await prisma.lecture.findUnique({
        where: { id: lectureId, courseId },
    });

    if (!lecture) {
        return <div className="text-red-600 text-center mt-10">Lecture not found.</div>;
    }

    async function handleEditLecture(formData: FormData) {
        "use server";
        const title = formData.get("title") as string;
        const description = formData.get("description") as string;
        await prisma.lecture.update({
            where: { id: lectureId },
            data: { title, description },
        });
    }

    return (
        <div className="container mx-auto max-w-2xl p-4 space-y-8">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-gray-800">Lecture Details</h1>
                <Link href={`/teacher/courses/${courseId}`} className="text-indigo-600 hover:underline text-sm">Back to Lectures</Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Edit Lecture</CardTitle>
                </CardHeader>
                <CardContent>
                    <form action={handleEditLecture} className="space-y-4">
                        <input name="title" defaultValue={lecture.title} required className="w-full border rounded px-3 py-2" />
                        <textarea name="description" defaultValue={lecture.description} required className="w-full border rounded px-3 py-2" rows={3} />
                        <Button type="submit">Save Changes</Button>
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Lecture Info</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="font-semibold text-lg">{lecture.title}</div>
                    <div className="text-gray-600 mb-2">{lecture.description}</div>
                    <div className="text-xs text-gray-400">Created: {formatDate(lecture.createdAt)}</div>
                    <div className="text-xs text-gray-400">Last Updated: {formatDate(lecture.updatedAt)}</div>
                </CardContent>
            </Card>
        </div>
    );
}

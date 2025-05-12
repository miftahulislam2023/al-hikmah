import { addLecture, getLecturesByCourse, deleteLecture } from "@/actions/lecture";
import { getCurrentTeacher } from "@/actions/teacher";
import { auth } from "@/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Lecture } from "@/lib/types";

export default async function CourseLecturesPage({ params }: { params: { courseId: string } }) {
    const session = await auth();
    if (!session) redirect("/signin");

    const { error } = await getCurrentTeacher();
    if (error) {
        return <div className="text-red-600 text-center mt-10">{error}</div>;
    }

    const courseId = Number(params.courseId);
    const { data: lectures, error: lectureError } = await getLecturesByCourse(courseId);

    async function handleAddLecture(formData: FormData) {
        "use server";
        const title = formData.get("title") as string;
        const description = formData.get("description") as string;
        await addLecture({ courseId, title, description });
    }

    async function handleDeleteLecture(formData: FormData) {
        "use server";
        const lectureId = Number(formData.get("lectureId"));
        await deleteLecture(lectureId);
    }

    return (
        <div className="container mx-auto max-w-3xl p-4 space-y-8">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-gray-800">Lectures</h1>
                <Link href="/teacher/courses" className="text-indigo-600 hover:underline text-sm">Back to Courses</Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Add New Lecture</CardTitle>
                </CardHeader>
                <CardContent>
                    <form action={handleAddLecture} className="space-y-4">
                        <input name="title" placeholder="Lecture Title" required className="w-full border rounded px-3 py-2" />
                        <textarea name="description" placeholder="Lecture Description" required className="w-full border rounded px-3 py-2" rows={3} />
                        <Button type="submit">Add Lecture</Button>
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>All Lectures</CardTitle>
                </CardHeader>
                <CardContent>
                    {lectureError ? (
                        <div className="text-red-600">{lectureError}</div>
                    ) : lectures && lectures.length > 0 ? (
                        <ul className="space-y-4">
                            {lectures.map((lecture: Lecture) => (
                                <li key={lecture.id} className="border rounded p-4">
                                    <div className="font-semibold text-lg">{lecture.title}</div>
                                    <div className="text-gray-600 mb-2">{lecture.description}</div>
                                    <div className="text-xs text-gray-400 mb-2">Created: {formatDate(lecture.createdAt)}</div>
                                    <div className="flex gap-2">
                                        <Link href={`/teacher/courses/${courseId}/${lecture.id}`}>
                                            <Button variant="outline" size="sm">Edit</Button>
                                        </Link>
                                        <form action={handleDeleteLecture} method="post" onSubmit={e => { if (!confirm('Delete this lecture?')) e.preventDefault(); }}>
                                            <input type="hidden" name="lectureId" value={lecture.id} />
                                            <Button type="submit" variant="destructive" size="sm">Delete</Button>
                                        </form>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="text-gray-500">No lectures yet.</div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
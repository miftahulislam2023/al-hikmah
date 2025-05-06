import prisma from "@/lib/prisma";

export default async function Dashboard({ params }: {
    params: {
        courseId: string;
    }
}) {
    const { courseId } = (await params);
    const course = await prisma.course.findUnique({
        where: {
            id: parseInt(courseId)
        }
    });
    console.log(course);
    return (
        <div>
            <h1>Dashboard</h1>
            <p>Course Dashboard for course: {courseId}</p>
        </div>
    )
}
"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function createLecture(formData: FormData) {
    const session = await auth();
    if (!session || session.user?.role !== "TEACHER") {
        return { error: "Not authorized" };
    }

    const courseId = formData.get("courseId") as string;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string | null;
    const videoUrl = formData.get("videoUrl") as string | null;
    const documentUrl = formData.get("documentUrl") as string | null;
    const order = parseInt(formData.get("order") as string) || 0;

    try {
        // Verify teacher has access to this course
        const course = await prisma.course.findFirst({
            where: {
                id: courseId,
                teachers: {
                    some: {
                        userId: session.user.id
                    }
                }
            }
        });

        if (!course) {
            return { error: "Course not found or access denied" };
        }

        const lecture = await prisma.lecture.create({
            data: {
                title,
                description,
                videoUrl,
                documentUrl,
                order,
                courseId,
            },
        });

        revalidatePath(`/teacher/courses/${courseId}`);
        revalidatePath(`/profile/courses/${courseId}`);

        return { success: true, data: lecture };
    } catch (error) {
        console.error("Error creating lecture:", error);
        return { error: "Failed to create lecture" };
    }
}

export async function updateLecture(formData: FormData) {
    const session = await auth();
    if (!session || session.user?.role !== "TEACHER") {
        return { error: "Not authorized" };
    }

    const lectureId = formData.get("lectureId") as string;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string | null;
    const videoUrl = formData.get("videoUrl") as string | null;
    const documentUrl = formData.get("documentUrl") as string | null;
    const order = parseInt(formData.get("order") as string) || 0;
    const isActive = formData.get("isActive") === "true";

    try {
        // Verify teacher has access to this lecture's course
        const lecture = await prisma.lecture.findFirst({
            where: {
                id: lectureId,
                course: {
                    teachers: {
                        some: {
                            userId: session.user.id
                        }
                    }
                }
            },
            include: {
                course: true
            }
        });

        if (!lecture) {
            return { error: "Lecture not found or access denied" };
        }

        const updatedLecture = await prisma.lecture.update({
            where: { id: lectureId },
            data: {
                title,
                description,
                videoUrl,
                documentUrl,
                order,
                isActive
            },
        });

        revalidatePath(`/teacher/courses/${lecture.courseId}`);
        revalidatePath(`/teacher/courses/${lecture.courseId}/${lectureId}`);
        revalidatePath(`/profile/courses/${lecture.courseId}`);

        return { success: true, data: updatedLecture };
    } catch (error) {
        console.error("Error updating lecture:", error);
        return { error: "Failed to update lecture" };
    }
}

export async function deleteLecture(lectureId: string) {
    const session = await auth();
    if (!session || session.user?.role !== "TEACHER") {
        return { error: "Not authorized" };
    }

    try {
        // Verify teacher has access to this lecture's course
        const lecture = await prisma.lecture.findFirst({
            where: {
                id: lectureId,
                course: {
                    teachers: {
                        some: {
                            userId: session.user.id
                        }
                    }
                }
            }
        });

        if (!lecture) {
            return { error: "Lecture not found or access denied" };
        }

        await prisma.lecture.delete({
            where: { id: lectureId }
        });

        revalidatePath(`/teacher/courses/${lecture.courseId}`);
        revalidatePath(`/profile/courses/${lecture.courseId}`);

        return { success: true };
    } catch (error) {
        console.error("Error deleting lecture:", error);
        return { error: "Failed to delete lecture" };
    }
}

export async function getLecturesByCourse(courseId: string) {
    try {
        const lectures = await prisma.lecture.findMany({
            where: {
                courseId,
                isActive: true
            },
            orderBy: { order: "asc" },
        });

        return { success: true, data: lectures };
    } catch (error) {
        console.error("Error fetching lectures:", error);
        return { error: "Failed to fetch lectures" };
    }
}

export async function getLectureById(lectureId: string) {
    try {
        const lecture = await prisma.lecture.findUnique({
            where: { id: lectureId },
            include: {
                course: {
                    include: {
                        teachers: {
                            include: {
                                user: true
                            }
                        }
                    }
                }
            }
        });

        if (!lecture) {
            return { error: "Lecture not found" };
        }

        return { success: true, data: lecture };
    } catch (error) {
        console.error("Error fetching lecture:", error);
        return { error: "Failed to fetch lecture" };
    }
}

export async function markLectureComplete(studentId: string, lectureId: string) {
    try {
        // Check if already completed
        const existing = await prisma.lectureProgress.findUnique({
            where: {
                studentId_lectureId: {
                    studentId,
                    lectureId
                }
            }
        });

        if (existing) {
            return { success: true, data: existing };
        }

        // Get lecture to find courseId for revalidation
        const lecture = await prisma.lecture.findUnique({
            where: { id: lectureId },
            select: { courseId: true }
        });

        const progress = await prisma.lectureProgress.create({
            data: {
                studentId,
                lectureId
            }
        });

        // Revalidate relevant paths
        revalidatePath(`/profile/courses`);
        if (lecture) {
            revalidatePath(`/profile/courses/${lecture.courseId}`);
        }

        return { success: true, data: progress };
    } catch (error) {
        console.error("Error marking lecture complete:", error);
        return { error: "Failed to mark lecture complete" };
    }
}

export async function getStudentProgress(studentId: string, courseId: string) {
    try {
        const progress = await prisma.lectureProgress.findMany({
            where: {
                studentId,
                lecture: {
                    courseId
                }
            },
            include: {
                lecture: true
            }
        });

        return { success: true, data: progress };
    } catch (error) {
        console.error("Error fetching student progress:", error);
        return { error: "Failed to fetch progress" };
    }
}

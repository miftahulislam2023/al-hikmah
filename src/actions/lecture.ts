"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";

// Add a lecture to a course (teacher must be authenticated)
export async function addLecture({ courseId, title, description }: { courseId: number; title: string; description: string }) {
    const session = await auth();
    if (!session || !session.user?.email) {
        return { error: "Not authenticated" };
    }
    try {
        const lecture = await prisma.lecture.create({
            data: {
                title,
                description,
                courseId,
            },
        });
        return { data: lecture };
    } catch (error) {
        
        return error;
    }
}

// Get all lectures for a course
export async function getLecturesByCourse(courseId: number) {
    try {
        const lectures = await prisma.lecture.findMany({
            where: { courseId },
            orderBy: { createdAt: "desc" },
        });
        return { data: lectures };
    } catch (error) {
        return error;
    }
}

// Delete a lecture by id (teacher must be authenticated)
export async function deleteLecture(lectureId: number) {
    const session = await auth();
    if (!session || !session.user?.email) {
        return { error: "Not authenticated" };
    }
    try {
        await prisma.lecture.delete({ where: { id: lectureId } });
        return { success: true };
    } catch (error) {
        
        return error;
    }
}

// Update a lecture by id (teacher must be authenticated)
export async function updateLecture({ lectureId, title, description }: { lectureId: number; title: string; description: string }) {
    const session = await auth();
    if (!session || !session.user?.email) {
        return { error: "Not authenticated" };
    }
    try {
        const lecture = await prisma.lecture.update({
            where: { id: lectureId },
            data: { title, description },
        });
        return { data: lecture };
    } catch (error) {
        return error;
    }
}

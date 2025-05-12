"use server";

import { Gender } from "@prisma/client";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

// Get the currently authenticated teacher
export async function getCurrentTeacher() {
    const session = await auth();

    if (!session || !session.user?.email) {
        return { error: "Not authenticated" };
    }

    try {
        const teacher = await prisma.teacher.findUnique({
            where: { email: session.user.email },
            include: {
                courses: true,
            },
        });

        if (!teacher) {
            return { error: "Teacher not found" };
        }

        return { data: teacher };
    } catch (error) {
        console.error("Error fetching teacher:", error);
        return { error: "Failed to fetch teacher data" };
    }
}

// Update teacher information
export async function updateTeacher(formData: FormData) {
    'use server';

    const session = await auth();

    if (!session || !session.user?.email) {
        return { error: "Not authenticated" };
    }

    try {
        const email = session.user.email;
        const name = formData.get("name") as string;
        const phone = formData.get("phone") as string;
        const address = formData.get("address") as string;
        const currentInstitute = formData.get("currentInstitute") as string;
        // Import the Gender enum from your Prisma client
        const genderStr = formData.get("gender") as string;
        const gender = genderStr ? (genderStr as Gender) : null;

        // Convert date string to Date object if it exists
        const dobString = formData.get("dob") as string;
        const dob = dobString ? new Date(dobString) : null;

        const updatedTeacher = await prisma.teacher.update({
            where: { email },
            data: {
                name,
                phone,
                address,
                currentInstitute,
                gender,
                dob,
            },
            include: {
                courses: true,
            },
        });

        // Return success without calling revalidatePath during render
        return { success: true, data: updatedTeacher };
    } catch (error) {
        console.error("Error updating teacher:", error);
        return { error: "Failed to update teacher data" };
    }
}

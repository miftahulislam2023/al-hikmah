"use server"

import prisma from "@/lib/prisma";
import { hash } from "bcryptjs";
import { Role, Gender, Class } from "@prisma/client";
import { revalidatePath } from "next/cache";

function generateRollNumber(sscBatch: number, studentClass: string, studentId: string) {
    const classMapping: Record<string, string> = {
        "SIX": "06",
        "SEVEN": "07",
        "EIGHT": "08",
        "NINE": "09",
        "TEN": "10",
        "ELEVEN": "11",
        "TWELVE": "12",
        "OTHER": "13",
    };
    const classCode = classMapping[studentClass.toUpperCase()] || "00";
    // Use a shorter hash of the student ID for the roll number
    const idHash = studentId.slice(-4);
    const rollNumber = `${sscBatch}${classCode}${idHash}`;
    return rollNumber;
}

export async function signUpStudent(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string | null;
    const phone = formData.get("phone") as string | null;
    const address = formData.get("address") as string | null;
    const dobValue = formData.get("dob") as string | null;
    const dob = dobValue ? new Date(dobValue) : null;
    const gender = formData.get("gender") as Gender | null;
    const currentInstitute = formData.get("currentInstitute") as string | null;
    const currentClass = formData.get("currentClass") as Class | null;
    const sscBatchValue = formData.get("sscBatch") as string | null;
    const sscBatch = sscBatchValue ? parseInt(sscBatchValue) : null;
    const guardianName = formData.get("guardianName") as string | null;
    const guardianPhone = formData.get("guardianPhone") as string | null;
    const guardianOccupation = formData.get("guardianOccupation") as string | null;

    try {
        // Check if user with this email already exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return { error: "A user with this email already exists" };
        }

        // Hash the password
        const hashedPassword = await hash(password, 10);

        // Create the user first
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                phone,
                role: Role.STUDENT,
            }
        });

        // Create the student profile
        const student = await prisma.student.create({
            data: {
                userId: user.id,
                address,
                dob,
                gender,
                currentInstitute,
                currentClass,
                sscBatch,
                guardianName,
                guardianPhone,
                guardianOccupation,
            }
        });

        // Generate and update roll number if sscBatch and currentClass are provided
        if (sscBatch && currentClass) {
            const rollNumber = generateRollNumber(
                sscBatch,
                currentClass,
                student.id
            );

            await prisma.student.update({
                where: { id: student.id },
                data: { roll: rollNumber },
            });
        }

        return { success: true };

    } catch (error) {
        console.error("Error creating student:", error);
        return { error: "Failed to create account" };
    }
}

export async function createTeacher(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string | null;
    const phone = formData.get("phone") as string | null;
    const address = formData.get("address") as string | null;
    const dobValue = formData.get("dob") as string | null;
    const dob = dobValue ? new Date(dobValue) : null;
    const gender = formData.get("gender") as Gender | null;
    const currentInstitute = formData.get("currentInstitute") as string | null;
    const specialization = formData.get("specialization") as string | null;
    const experienceValue = formData.get("experience") as string | null;
    const experience = experienceValue ? parseInt(experienceValue) : null;

    try {
        // Check if user with this email already exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return { error: "A user with this email already exists" };
        }

        // Hash the password
        const hashedPassword = await hash(password, 10);

        // Create the user first
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                phone,
                role: Role.TEACHER,
            }
        });

        // Create the teacher profile
        await prisma.teacher.create({
            data: {
                userId: user.id,
                address,
                dob,
                gender,
                currentInstitute,
                specialization,
                experience,
            }
        });

        revalidatePath("/admin/teachers");
        return { success: true };

    } catch (error) {
        console.error("Error creating teacher:", error);
        return { error: "Failed to create teacher account" };
    }
}

export async function createAdmin(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string | null;
    const phone = formData.get("phone") as string | null;

    try {
        // Check if user with this email already exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return { error: "A user with this email already exists" };
        }

        // Hash the password
        const hashedPassword = await hash(password, 10);

        // Create the user first
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                phone,
                role: Role.ADMIN,
            }
        });

        // Create the admin profile
        await prisma.admin.create({
            data: {
                userId: user.id,
            }
        });

        revalidatePath("/admin");
        return { success: true };

    } catch (error) {
        console.error("Error creating admin:", error);
        return { error: "Failed to create admin account" };
    }
}

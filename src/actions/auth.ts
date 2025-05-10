"use server"

import prisma from "@/lib/prisma";
import { hash } from "bcryptjs";
import { Class, Gender } from "@/lib/types";

function generateRollNumber(sscBatch: number, studentClass: string, studentId: number) {
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
    const rollNumber = `${sscBatch}${classCode}${String(studentId).padStart(4, "0")}`;
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
        const existingUser = await prisma.student.findUnique({
            where: { email }
        });

        if (existingUser) {
            console.log("Student already exists");
            return { error: "A student with this email already exists" };
        }

        // Hash the password
        const hashedPassword = await hash(password, 10);

        // Create the student with all information
        const student = await prisma.student.create({
            data: {
                email,
                password: hashedPassword,
                name,
                phone,
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

        if (student) {
            console.log("Student created successfully!");

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

                console.log("Roll number generated and updated:", rollNumber);
            }

            return { success: true };
        }

    } catch (error) {
        console.error("Error creating student:", error);
        return { error: "Failed to create account" };
    }
}

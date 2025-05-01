"use server"

import prisma from "@/lib/prisma";
import { hash } from "bcryptjs";

export async function signupStudent(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
        // Check if user with this email already exists
        const existingUser = await prisma.student.findUnique({
            where: { email }
        });

        if (existingUser) {
            console.log("Student already exists");
        }

        // Hash the password
        const hashedPassword = await hash(password, 10);

        // Create the student with minimal information
        // Other details can be filled in later
        const student = await prisma.student.create({
            data: {
                email: email,
                password: hashedPassword,
            }
        });

        if (student) {
            console.log("Student created successfully!");
        }

    } catch (error) {
        console.error("Error creating student:", error);
    }
}

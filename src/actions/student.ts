"use server"
import prisma from "@/lib/prisma";
import { Class, Gender, Student, StudentResponse } from "@/lib/types";
import { revalidatePath } from "next/cache";

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

export async function registerStudent(formData: FormData): Promise<void> {
    const dobValue = formData.get("dob") as string | null;
    const dob = dobValue ? new Date(dobValue) : null;

    const data = {
        name: formData.get("name") as string | null,
        address: formData.get("address") as string | null,
        phone: formData.get("phone") as string | null,
        email: formData.get("email") as string,
        dob: dob ?? new Date(),
        gender: formData.get("gender") as Gender,
        currentInstitute: formData.get("currentInstitute") as string | null,
        currentClass: formData.get("currentClass") as Class,
        sscBatch: parseInt(formData.get("sscBatch") as string),
        guardianName: formData.get("guardianName") as string | null,
        guardianPhone: formData.get("guardianPhone") as string | null,
        guardianOccupation: formData.get("guardianOccupation") as string | null,
    };

    try {
        const student = await prisma.student.create({ data });

        const rollNumber = generateRollNumber(
            data.sscBatch,
            data.currentClass,
            student.id
        );

        await prisma.student.update({
            where: { id: student.id },
            data: { roll: rollNumber },
        });

        console.log("Student created with roll number:", rollNumber);
    } catch (e) {
        console.error("Error creating student:", e);
    }
}

export async function searchStudentByEmail(_: FormData, formData: FormData): Promise<StudentResponse> {
    const email = formData.get("email") as string;

    if (!email) return { error: "Email number is required" };

    try {
        const student = await prisma.student.findUnique({
            where: { email },
            include: { courses: true },
        });

        if (!student) return { error: "Student not found" };

        // Use destructuring to remove password but we're not using the variable
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...safeStudent } = student;
        return safeStudent as unknown as StudentResponse;
    } catch (e) {
        console.error("Search error:", e);
        return { error: "Internal server error" };
    }
}

export async function getStudentByEmail(email: string) {
    const decodedEmail = email.replace('%40', '@');
    try {
        const student = await prisma.student.findUnique({
            where: { email: decodedEmail },
            include: { courses: true },
        });
        if (!student) return { error: "Student not found" };
        return student as unknown as StudentResponse;
    } catch (e) {
        console.error("Error retrieving student:", e);
        return { error: "Internal server error" };
    }
}

export async function updateStudent(formData: FormData): Promise<void> {
    try {
        const id = formData.get("id");
        if (!id) {
            console.error("Student ID is required");
            return;
        }
        let roll = formData.get("roll") as string | null;
        if (formData.get("roll") === null) {
            roll = generateRollNumber(parseInt(formData.get("sscBatch") as string), formData.get("currentClass") as string, Number(id));
        }
        type StudentUpdateData = Omit<Partial<Student>, 'id' | 'courses' | 'createdAt' | 'updatedAt'>;

        // Prepare update data according to schema
        const updateData: StudentUpdateData = {
            name: formData.get("name") as string | null,
            address: formData.get("address") as string | null,
            phone: formData.get("phone") as string | null,
            email: formData.get("email") as string | null,
            dob: formData.get("dob") ? new Date(formData.get("dob") as string) : undefined,
            gender: formData.get("gender") as Gender,
            currentInstitute: formData.get("currentInstitute") as string | null,
            currentClass: formData.get("currentClass") as Class,
            sscBatch: formData.get("sscBatch") ? parseInt(formData.get("sscBatch") as string) : undefined,
            guardianName: formData.get("guardianName") as string | null,
            guardianPhone: formData.get("guardianPhone") as string | null,
            guardianOccupation: formData.get("guardianOccupation") as string | null,
            roll
        };

        // Remove undefined fields (Prisma will not update them)
        Object.keys(updateData).forEach(
            (key) => updateData[key as keyof StudentUpdateData] === undefined && delete updateData[key as keyof StudentUpdateData]
        );

        await prisma.student.update({
            where: { id: Number(id) },
            data: updateData,
        });

        revalidatePath('/admin/students/*');
    } catch (e) {
        console.error("Error updating student:", e);
    }
}

/**
 * Enhanced student profile update function with better error handling and redirection
 */
export async function updateStudentProfile(formData: FormData): Promise<void> {
    try {
        const id = formData.get("id");
        if (!id) {
            console.error("Student ID is required");
            return;
        }
        let roll = formData.get("roll") as string | null;
        // Log form data for debugging
        console.log("Updating student profile for ID:", id);
        if (formData.get("roll") === null) {
            roll = generateRollNumber(parseInt(formData.get("sscBatch") as string), formData.get("currentClass") as string, Number(id));
        }
        const name = formData.get("name") as string | null;
        const email = formData.get("email") as string;
        const phone = formData.get("phone") as string | null;
        const address = formData.get("address") as string | null;
        const dobValue = formData.get("dob") as string | null;
        const dob = dobValue ? new Date(dobValue) : null;
        const gender = formData.get("gender") as Gender | null;
        const currentInstitute = formData.get("currentInstitute") as string | null;
        const currentClass = formData.get("currentClass") as Class | null;
        const sscBatchValue = formData.get("sscBatch") as string | null;
        const sscBatch = sscBatchValue && sscBatchValue.trim() !== "" ? parseInt(sscBatchValue) : null;
        const guardianName = formData.get("guardianName") as string | null;
        const guardianPhone = formData.get("guardianPhone") as string | null;
        const guardianOccupation = formData.get("guardianOccupation") as string | null;

        // Create update data object
        const updateData = {
            name,
            email,
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
            roll,
        };

        console.log("Update data:", updateData);

        // Update the student record
        const updatedStudent = await prisma.student.update({
            where: { id: Number(id) },
            data: updateData,
        });

        console.log("Student updated successfully:", updatedStudent.id);

        revalidatePath('/profile');
        revalidatePath('/profile/edit');

        // Add a slight delay to ensure revalidation has time to process
        await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
        console.error("Error updating student profile:", error);
        // Don't return an object to maintain the correct return type
    }
}

export async function addCourseToStudent(studentId: number, courseId: number): Promise<void> {
    try {
        await prisma.student.update({
            where: { id: studentId },
            data: {
                courses: {
                    connect: { id: courseId },
                },
            },
        });
    } catch (e) {
        console.error("Error adding course:", e);
    }
}

export async function removeCourseFromStudent(studentId: number, courseId: number): Promise<void> {
    try {
        await prisma.student.update({
            where: { id: studentId },
            data: {
                courses: {
                    disconnect: { id: courseId },
                },
            },
        });
    } catch (e) {
        console.error("Error removing course:", e);
    }
}
"use server"
import prisma from "@/lib/prisma";
import { Class, Gender, Student, StudentResponse } from "@/lib/types";

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

export async function searchStudentByRoll(_: FormData, formData: FormData): Promise<StudentResponse> {
    const roll = formData.get("roll") as string;

    if (!roll) return { error: "Roll number is required" };

    try {
        const id = parseInt(roll.slice(-4));
        const student = await prisma.student.findUnique({
            where: { id },
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

export async function getStudentByRoll(roll: string): Promise<StudentResponse> {
    if (!roll) return { error: "Roll number is required" };
    const id = parseInt(roll.slice(-4));
    try {
        const student = await prisma.student.findUnique({
            where: { id },
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

        // Remove id from the update data
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
        };

        // Remove undefined fields (Prisma will not update them)
        Object.keys(updateData).forEach(
            (key) => updateData[key as keyof StudentUpdateData] === undefined && delete updateData[key as keyof StudentUpdateData]
        );

        await prisma.student.update({
            where: { id: Number(id) },
            data: updateData,
        });
    } catch (e) {
        console.error("Error updating student:", e);
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
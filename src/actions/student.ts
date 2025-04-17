"use server"
import prisma from "@/lib/prisma";

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

export async function registerStudent(formData: FormData) {
    const dobValue = formData.get("dob") as string | null;
    const dob = dobValue ? new Date(dobValue) : null;

    const data = {
        name: formData.get("name") as string | null,
        address: formData.get("address") as string | null,
        phone: formData.get("phone") as string | null,
        email: formData.get("email") as string,
        dob: dob ?? new Date(),
        gender: formData.get("gender") as any,
        currentInstitute: formData.get("currentInstitute") as string | null,
        currentClass: formData.get("currentClass") as any,
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

export async function searchStudentByRoll(_: any, formData: FormData) {
    const roll = formData.get("roll") as string;

    if (!roll) return { error: "Roll number is required" };

    try {
        const id = parseInt(roll.slice(-4));
        const student = await prisma.student.findUnique({
            where: { id },
            include: { courses: true },
        });

        if (!student) return { error: "Student not found" };

        const { password, ...safeStudent } = student;
        return safeStudent;
    } catch (error) {
        console.error("Search error:", error); // ✅ Optional: Log for debugging
        return { error: "Internal server error" };
    }
}

export async function getStudentByRoll(roll: string) {
    if (!roll) return { error: "Roll number is required" };
    const id = parseInt(roll.slice(-4));
    try {
        const student = await prisma.student.findUnique({
            where: { id },
            include: { courses: true },
        });

        if (!student) return { error: "Student not found" };
        return student;
    } catch (error) {
        return { error: "Internal server error" };
    }
}

export async function updateStudent(formData: FormData) {
    try {
        const id = formData.get("id");
        if (!id) {
            return { error: "Student ID is required" };
        }

        // Prepare update data according to schema
        const updateData: any = {
            name: formData.get("name") as string | null,
            address: formData.get("address") as string | null,
            phone: formData.get("phone") as string | null,
            email: formData.get("email") as string | null,
            dob: formData.get("dob") ? new Date(formData.get("dob") as string) : undefined,
            gender: formData.get("gender") as any,
            currentInstitute: formData.get("currentInstitute") as string | null,
            currentClass: formData.get("currentClass") as any,
            sscBatch: formData.get("sscBatch") ? parseInt(formData.get("sscBatch") as string) : undefined,
            guardianName: formData.get("guardianName") as string | null,
            guardianPhone: formData.get("guardianPhone") as string | null,
            guardianOccupation: formData.get("guardianOccupation") as string | null,
        };

        // Remove undefined fields (Prisma will not update them)
        Object.keys(updateData).forEach(
            (key) => updateData[key] === undefined && delete updateData[key]
        );

        const updatedStudent = await prisma.student.update({
            where: { id: Number(id) },
            data: updateData,
        });

        return updatedStudent;
    } catch (error) {
        return { error: "Failed to update student" };
    }
}

export async function addCourseToStudent(studentId: number, courseId: number) {
    try {
        const updatedStudent = await prisma.student.update({
            where: { id: studentId },
            data: {
                courses: {
                    connect: { id: courseId },
                },
            },
            include: { courses: true },
        });
        return updatedStudent;
    } catch (error) {
        return { error: "Failed to add course to student" };
    }
}

export async function removeCourseFromStudent(studentId: number, courseId: number) {
    try {
        const updatedStudent = await prisma.student.update({
            where: { id: studentId },
            data: {
                courses: {
                    disconnect: { id: courseId },
                },
            },
            include: { courses: true },
        });
        return updatedStudent;
    } catch (error) {
        return { error: "Failed to remove course from student" };
    }
}
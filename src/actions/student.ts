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

export async function getStudentByRoll(_: any, formData: FormData) {
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
    } catch {
        return { error: "Internal server error" };
    }
}

export async function getStudentById(id: number) {
    if (!id) return { error: "Roll number is required" };

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

//done
export async function updateStudent(formData: FormData) {
    try {
        let studentData: any = Object.fromEntries(formData);

        // Extract values from the formData
        let {
            roll,
            name,
            guardianName,
            guardianOccupation,
            mothersName,
            mothersOccupation,
            address,
            phone,
            nickname,
            dob, // Use dob directly instead of dobValue
            gender,
            currentInstitute,
            currentClass,
            sscBatch,
            batchTime
        } = studentData;

        // Parse DOB and ensure it's a valid date
        const parsedDob = dob ? new Date(dob) : new Date(); // Ensure valid Date format

        // Convert the roll number to an id (assuming roll number is part of the id)
        const id = parseInt(String(roll).slice(-4));
        sscBatch = parseInt(sscBatch);

        // Update the student data in the database
        const updatedStudent = await prisma.student.update({
            where: { id },
            data: {
                name,
                guardianName,
                guardianOccupation,
                address,
                phone,
                dob: parsedDob, // Use the parsed dob
                gender,
                currentInstitute,
                currentClass,
                sscBatch,
            }
        });

        return updatedStudent;
    } catch (error) {
        return { error: "Failed to update student" };
    }
}

//done
export async function deleteStudent(formData: FormData) {
    try {
        const rollValue = formData.get("roll");
        if (!rollValue) {
            return { error: "Roll number is required" };
        }
        const id = parseInt(rollValue.toString().slice(-4));
        console.log(id);
        await prisma.student.delete({ where: { id } });
        return { message: "Student deleted successfully" };
    } catch (error) {
        return { error: "Failed to delete student" };
    }
}

export async function completeStudent(studentData: any) {
    try {
        let {
            roll,
            id,
            name,
            guardianName,
            guardianOccupation,
            mothersName,
            mothersOccupation,
            address,
            phone,
            nickname,
            dob,
            gender,
            currentInstitute,
            currentClass,
            sscBatch,
            batchTime
        } = studentData;

        if (!id) {
            throw new Error("Student ID is required");
        }

        // Ensure dob is a valid Date object
        dob = dob ? new Date(dob) : null;
        sscBatch = parseInt(sscBatch);
        roll = parseInt(generateRollNumber(sscBatch, currentClass, id));
        const updatedStudent = await prisma.student.update({
            where: { id },
            data: {
                roll,
                name,
                guardianName,
                guardianOccupation,
                address,
                phone,
                dob,
                gender,
                currentInstitute,
                currentClass,
                sscBatch
            }
        });

        return updatedStudent;
    } catch (error) {
        console.error("Failed to update student:", error);
        return { error: "Failed to update student" };
    }
}

export async function buyCourseById(courseId: number, studentId: number) {
    try {
        const updatedCourse = await prisma.course.update({
            where: { id: courseId },
            data: {
                students: {
                    connect: { id: studentId },
                },
            },
        });

        return { updatedCourse, added: true };
    } catch (error) {
        console.error("Error adding student to course:", error);
        return { error: "Failed to enroll student in course" };
    }
}

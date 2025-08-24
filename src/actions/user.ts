"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { Gender, Class } from "@prisma/client";

// Admin Actions - User Management
export async function getAllStudents() {
    try {
        const students = await prisma.student.findMany({
            include: {
                user: true,
                enrollments: {
                    include: {
                        course: true
                    }
                },
                _count: {
                    select: {
                        enrollments: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return { success: true, data: students };
    } catch (error) {
        console.error("Error fetching students:", error);
        return { error: "Failed to fetch students" };
    }
}

export async function getAllTeachers() {
    try {
        const teachers = await prisma.teacher.findMany({
            include: {
                user: true,
                courses: {
                    include: {
                        _count: {
                            select: {
                                enrollments: true
                            }
                        }
                    }
                },
                _count: {
                    select: {
                        courses: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return { success: true, data: teachers };
    } catch (error) {
        console.error("Error fetching teachers:", error);
        return { error: "Failed to fetch teachers" };
    }
}

export async function getAllAdmins() {
    try {
        const admins = await prisma.admin.findMany({
            include: {
                user: true,
                enrollmentVerifications: {
                    include: {
                        course: true,
                        student: {
                            include: {
                                user: true
                            }
                        }
                    }
                },
                _count: {
                    select: {
                        enrollmentVerifications: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return { success: true, data: admins };
    } catch (error) {
        console.error("Error fetching admins:", error);
        return { error: "Failed to fetch admins" };
    }
}

export async function getStudentById(studentId: string) {
    try {
        const student = await prisma.student.findUnique({
            where: { id: studentId },
            include: {
                user: true,
                enrollments: {
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
                },
                lectureProgress: {
                    include: {
                        lecture: {
                            include: {
                                course: true
                            }
                        }
                    }
                },
                quizAttempts: {
                    include: {
                        quiz: {
                            include: {
                                course: true
                            }
                        }
                    }
                }
            }
        });

        if (!student) {
            return { error: "Student not found" };
        }

        return { success: true, data: student };
    } catch (error) {
        console.error("Error fetching student:", error);
        return { error: "Failed to fetch student" };
    }
}

export async function updateStudentProfile(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) {
        return { error: "Not authenticated" };
    }

    const studentId = formData.get("studentId") as string;
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
        // Check if user is updating their own profile or is an admin
        const student = await prisma.student.findUnique({
            where: { id: studentId },
            include: { user: true }
        });

        if (!student) {
            return { error: "Student not found" };
        }

        if (session.user.role !== "ADMIN" && session.user.id !== student.user.id) {
            return { error: "Not authorized to update this profile" };
        }

        // Update user data
        await prisma.user.update({
            where: { id: student.user.id },
            data: {
                name,
                phone
            }
        });

        // Update student data
        const updatedStudent = await prisma.student.update({
            where: { id: studentId },
            data: {
                address,
                dob,
                gender,
                currentInstitute,
                currentClass,
                sscBatch,
                guardianName,
                guardianPhone,
                guardianOccupation,
            },
            include: {
                user: true
            }
        });

        revalidatePath("/profile");
        revalidatePath("/profile/edit");
        if (session.user.role === "ADMIN") {
            revalidatePath("/admin/students");
            revalidatePath(`/admin/students/${studentId}`);
        }

        return { success: true, data: updatedStudent };
    } catch (error) {
        console.error("Error updating student profile:", error);
        return { error: "Failed to update profile" };
    }
}

export async function updateTeacherProfile(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) {
        return { error: "Not authenticated" };
    }

    const teacherId = formData.get("teacherId") as string;
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
        // Check if user is updating their own profile or is an admin
        const teacher = await prisma.teacher.findUnique({
            where: { id: teacherId },
            include: { user: true }
        });

        if (!teacher) {
            return { error: "Teacher not found" };
        }

        if (session.user.role !== "ADMIN" && session.user.id !== teacher.user.id) {
            return { error: "Not authorized to update this profile" };
        }

        // Update user data
        await prisma.user.update({
            where: { id: teacher.user.id },
            data: {
                name,
                phone
            }
        });

        // Update teacher data
        const updatedTeacher = await prisma.teacher.update({
            where: { id: teacherId },
            data: {
                address,
                dob,
                gender,
                currentInstitute,
                specialization,
                experience,
            },
            include: {
                user: true
            }
        });

        revalidatePath("/teacher/profile");
        revalidatePath("/teacher/profile/edit");
        if (session.user.role === "ADMIN") {
            revalidatePath("/admin/teachers");
        }

        return { success: true, data: updatedTeacher };
    } catch (error) {
        console.error("Error updating teacher profile:", error);
        return { error: "Failed to update profile" };
    }
}

export async function deleteStudent(studentId: string) {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMIN") {
        return { error: "Not authorized" };
    }

    try {
        const student = await prisma.student.findUnique({
            where: { id: studentId },
            include: { user: true }
        });

        if (!student) {
            return { error: "Student not found" };
        }

        // Delete student (will cascade delete user due to onDelete: Cascade)
        await prisma.user.delete({
            where: { id: student.user.id }
        });

        revalidatePath("/admin/students");
        return { success: true };
    } catch (error) {
        console.error("Error deleting student:", error);
        return { error: "Failed to delete student" };
    }
}

export async function deleteTeacher(teacherId: string) {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMIN") {
        return { error: "Not authorized" };
    }

    try {
        const teacher = await prisma.teacher.findUnique({
            where: { id: teacherId },
            include: { user: true }
        });

        if (!teacher) {
            return { error: "Teacher not found" };
        }

        // Delete teacher (will cascade delete user due to onDelete: Cascade)
        await prisma.user.delete({
            where: { id: teacher.user.id }
        });

        revalidatePath("/admin/teachers");
        return { success: true };
    } catch (error) {
        console.error("Error deleting teacher:", error);
        return { error: "Failed to delete teacher" };
    }
}

export async function searchStudents(query: string) {
    try {
        const students = await prisma.student.findMany({
            where: {
                OR: [
                    {
                        user: {
                            name: {
                                contains: query,
                                mode: 'insensitive'
                            }
                        }
                    },
                    {
                        user: {
                            email: {
                                contains: query,
                                mode: 'insensitive'
                            }
                        }
                    },
                    {
                        roll: {
                            contains: query,
                            mode: 'insensitive'
                        }
                    }
                ]
            },
            include: {
                user: true,
                enrollments: {
                    include: {
                        course: true
                    }
                }
            },
            take: 10
        });

        return { success: true, data: students };
    } catch (error) {
        console.error("Error searching students:", error);
        return { error: "Failed to search students" };
    }
}

export async function getTeacherByEmail(email: string) {
    try {
        const teacher = await prisma.teacher.findFirst({
            where: {
                user: {
                    email: email
                }
            },
            include: {
                user: true,
                courses: true,
                _count: {
                    select: {
                        courses: true
                    }
                }
            }
        });

        if (!teacher) {
            return { error: "Teacher not found" };
        }

        return { success: true, data: teacher };
    } catch (error) {
        console.error("Error fetching teacher:", error);
        return { error: "Failed to fetch teacher" };
    }
}

export async function updateTeacher(teacherId: string, formData: FormData) {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMIN") {
        return { error: "Not authorized" };
    }

    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string | null;
    const dob = formData.get("dob") as string | null;
    const gender = formData.get("gender") as string | null;
    const address = formData.get("address") as string | null;
    const experience = formData.get("experience") as string | null;
    const currentInstitute = formData.get("currentInstitute") as string | null;
    const specialization = formData.get("specialization") as string | null;

    try {
        const teacher = await prisma.teacher.findUnique({
            where: { id: teacherId },
            include: { user: true }
        });

        if (!teacher) {
            return { error: "Teacher not found" };
        }

        // Update user information
        await prisma.user.update({
            where: { id: teacher.user.id },
            data: {
                name,
                phone: phone || null,
            }
        });

        // Update teacher-specific information
        await prisma.teacher.update({
            where: { id: teacherId },
            data: {
                dob: dob ? new Date(dob) : null,
                gender: gender ? (gender as "MALE" | "FEMALE") : null,
                address: address || null,
                experience: experience ? parseInt(experience) : null,
                currentInstitute: currentInstitute || null,
                specialization: specialization || null,
            }
        });

        revalidatePath("/admin/teachers");
        revalidatePath(`/admin/teachers/${teacher.user.email}`);

        return { success: true };
    } catch (error) {
        console.error("Error updating teacher:", error);
        return { error: "Failed to update teacher" };
    }
}

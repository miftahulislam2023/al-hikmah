"use server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createCourse(formData: FormData) {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string | null;
    const semester = formData.get("semester") as string | null;
    const price = parseFloat(formData.get("price") as string) || 0;
    const posterUrl = formData.get("posterUrl") as string | null;
    const isActive = formData.get("isActive") === "true";
    const teacherIds = formData.getAll("teacherIds") as string[];

    try {
        const course = await prisma.course.create({
            data: {
                title,
                description,
                semester,
                price,
                posterUrl,
                isActive,
                teachers: {
                    connect: teacherIds.map(id => ({ id }))
                }
            },
            include: {
                teachers: {
                    include: {
                        user: true
                    }
                }
            }
        });

        revalidatePath("/admin/courses");
        return { success: true, data: course };
    } catch (error) {
        console.error("Error creating course:", error);
        return { error: "Failed to create course" };
    }
}

export async function updateCourse(formData: FormData) {
    const courseId = formData.get("courseId") as string;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string | null;
    const semester = formData.get("semester") as string | null;
    const price = parseFloat(formData.get("price") as string) || 0;
    const posterUrl = formData.get("posterUrl") as string | null;
    const isActive = formData.get("isActive") === "true";
    const teacherIds = formData.getAll("teacherIds") as string[];

    try {
        const course = await prisma.course.update({
            where: { id: courseId },
            data: {
                title,
                description,
                semester,
                price,
                posterUrl,
                isActive,
                teachers: {
                    set: teacherIds.map(id => ({ id }))
                }
            },
            include: {
                teachers: {
                    include: {
                        user: true
                    }
                }
            }
        });

        revalidatePath("/admin/courses");
        revalidatePath(`/admin/courses/${courseId}`);
        return { success: true, data: course };
    } catch (error) {
        console.error("Error updating course:", error);
        return { error: "Failed to update course" };
    }
}

export async function deleteCourse(courseId: string) {
    try {
        const deletedCourse = await prisma.course.delete({
            where: { id: courseId },
        });

        revalidatePath("/admin/courses");
        return { success: true, data: deletedCourse };
    } catch (error) {
        console.error("Error deleting course:", error);
        return { error: "Failed to delete course" };
    }
}

export async function getAllCourses() {
    try {
        const courses = await prisma.course.findMany({
            include: {
                teachers: {
                    include: {
                        user: true
                    }
                },
                lectures: {
                    where: { isActive: true },
                    orderBy: { order: 'asc' }
                },
                enrollments: true,
                _count: {
                    select: {
                        enrollments: true,
                        lectures: true,
                        quizzes: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        return { success: true, data: courses };
    } catch (error) {
        console.error("Error fetching courses:", error);
        return { error: "Failed to fetch courses" };
    }
}

export async function getActiveCourses() {
    try {
        const courses = await prisma.course.findMany({
            where: { isActive: true },
            include: {
                teachers: {
                    include: {
                        user: true
                    }
                },
                _count: {
                    select: {
                        enrollments: true,
                        lectures: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        return { success: true, data: courses };
    } catch (error) {
        console.error("Error fetching active courses:", error);
        return { error: "Failed to fetch courses" };
    }
}

export async function getCourseById(courseId: string) {
    try {
        const course = await prisma.course.findUnique({
            where: { id: courseId },
            include: {
                teachers: {
                    include: {
                        user: true
                    }
                },
                lectures: {
                    where: { isActive: true },
                    orderBy: { order: 'asc' }
                },
                quizzes: {
                    where: { isActive: true },
                    include: {
                        questions: true,
                        _count: {
                            select: { questions: true }
                        }
                    }
                },
                enrollments: {
                    include: {
                        student: {
                            include: {
                                user: true
                            }
                        }
                    }
                },
                _count: {
                    select: {
                        enrollments: true,
                        lectures: true,
                        quizzes: true
                    }
                }
            }
        });

        if (!course) {
            return { error: "Course not found" };
        }

        return { success: true, data: course };
    } catch (error) {
        console.error("Error fetching course by ID:", error);
        return { error: "Failed to fetch course" };
    }
}

export async function getStudentCourses(studentId: string) {
    try {
        const enrollments = await prisma.enrollment.findMany({
            where: {
                studentId,
                paymentStatus: "VERIFIED"
            },
            include: {
                course: {
                    include: {
                        teachers: {
                            include: {
                                user: true
                            }
                        },
                        lectures: {
                            where: { isActive: true },
                            orderBy: { order: 'asc' }
                        },
                        _count: {
                            select: {
                                lectures: true
                            }
                        }
                    }
                }
            },
            orderBy: { enrolledAt: 'desc' }
        });

        const courses = enrollments.map(enrollment => enrollment.course);
        return { success: true, data: courses };
    } catch (error) {
        console.error("Error fetching student courses:", error);
        return { error: "Failed to fetch courses" };
    }
}

export async function getTeacherCourses(teacherId: string) {
    try {
        const courses = await prisma.course.findMany({
            where: {
                teachers: {
                    some: {
                        id: teacherId
                    }
                }
            },
            include: {
                teachers: {
                    include: {
                        user: true
                    }
                },
                lectures: {
                    where: { isActive: true },
                    orderBy: { order: 'asc' }
                },
                enrollments: {
                    where: {
                        paymentStatus: "VERIFIED"
                    }
                },
                _count: {
                    select: {
                        enrollments: true,
                        lectures: true,
                        quizzes: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        return { success: true, data: courses };
    } catch (error) {
        console.error("Error fetching teacher courses:", error);
        return { error: "Failed to fetch courses" };
    }
}

export async function assignTeacherToCourse(formData: FormData) {
    const courseId = formData.get("courseId") as string;
    const teacherId = formData.get("teacherId") as string;

    try {
        const updatedCourse = await prisma.course.update({
            where: { id: courseId },
            data: {
                teachers: {
                    connect: { id: teacherId }
                }
            },
            include: {
                teachers: {
                    include: {
                        user: true
                    }
                }
            }
        });

        revalidatePath("/admin/courses/assign");
        revalidatePath("/admin/courses");
        return { success: true, data: updatedCourse };
    } catch (error) {
        console.error("Error assigning teacher to course:", error);
        return { error: "Failed to assign teacher to course" };
    }
}

export async function removeTeacherFromCourse(formData: FormData) {
    const courseId = formData.get("courseId") as string;
    const teacherId = formData.get("teacherId") as string;

    try {
        const updatedCourse = await prisma.course.update({
            where: { id: courseId },
            data: {
                teachers: {
                    disconnect: { id: teacherId }
                }
            },
            include: {
                teachers: {
                    include: {
                        user: true
                    }
                }
            }
        });

        revalidatePath("/admin/courses/assign");
        revalidatePath("/admin/courses");
        return { success: true, data: updatedCourse };
    } catch (error) {
        console.error("Error removing teacher from course:", error);
        return { error: "Failed to remove teacher from course" };
    }
}

export async function getCoursesWithTeachers() {
    try {
        const courses = await prisma.course.findMany({
            include: {
                teachers: {
                    include: {
                        user: true
                    }
                },
                _count: {
                    select: {
                        enrollments: true,
                        lectures: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        return { success: true, data: courses };
    } catch (error) {
        console.error("Error fetching courses with teachers:", error);
        return { error: "Failed to fetch courses" };
    }
}
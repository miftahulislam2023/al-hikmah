"use server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { PaymentMethod, PaymentStatus } from "@prisma/client";

export async function enrollInCourse(studentId: string, courseId: string) {
    try {
        // Check if already enrolled
        const existingEnrollment = await prisma.enrollment.findUnique({
            where: {
                studentId_courseId: {
                    studentId,
                    courseId
                }
            }
        });

        if (existingEnrollment) {
            return { error: "Already enrolled in this course" };
        }

        // Get course details
        const course = await prisma.course.findUnique({
            where: { id: courseId }
        });

        if (!course) {
            return { error: "Course not found" };
        }

        // Create enrollment
        const enrollment = await prisma.enrollment.create({
            data: {
                studentId,
                courseId,
                hasPaid: course.price === 0, // Auto-approve free courses
                paymentStatus: course.price === 0 ? PaymentStatus.VERIFIED : PaymentStatus.PENDING
            },
            include: {
                course: true,
                student: {
                    include: {
                        user: true
                    }
                }
            }
        });

        revalidatePath("/profile/courses");
        revalidatePath(`/profile/courses/${courseId}`);

        return { success: true, data: enrollment };
    } catch (error) {
        console.error("Error enrolling in course:", error);
        return { error: "Failed to enroll in course" };
    }
}

export async function submitPayment(
    enrollmentId: string,
    transactionId: string,
    paymentAmount: number,
    paymentMethod: PaymentMethod
) {
    try {
        const enrollment = await prisma.enrollment.update({
            where: { id: enrollmentId },
            data: {
                transactionId,
                paymentAmount,
                paymentMethod,
                paymentStatus: PaymentStatus.PENDING
            },
            include: {
                course: true,
                student: {
                    include: {
                        user: true
                    }
                }
            }
        });

        revalidatePath("/profile/courses");
        revalidatePath("/admin/payment");

        return { success: true, data: enrollment };
    } catch (error) {
        console.error("Error submitting payment:", error);
        return { error: "Failed to submit payment" };
    }
}

export async function verifyPayment(enrollmentId: string, adminId: string, approve: boolean) {
    try {
        const enrollment = await prisma.enrollment.update({
            where: { id: enrollmentId },
            data: {
                paymentStatus: approve ? PaymentStatus.VERIFIED : PaymentStatus.REJECTED,
                hasPaid: approve,
                verifiedAt: approve ? new Date() : null,
                verifiedById: approve ? adminId : null
            },
            include: {
                course: true,
                student: {
                    include: {
                        user: true
                    }
                },
                verifiedBy: {
                    include: {
                        user: true
                    }
                }
            }
        });

        revalidatePath("/admin/payment");
        revalidatePath("/profile/courses");

        return { success: true, data: enrollment };
    } catch (error) {
        console.error("Error verifying payment:", error);
        return { error: "Failed to verify payment" };
    }
}

export async function getPendingPayments() {
    try {
        const pendingPayments = await prisma.enrollment.findMany({
            where: {
                paymentStatus: PaymentStatus.PENDING,
                transactionId: {
                    not: null
                }
            },
            include: {
                course: true,
                student: {
                    include: {
                        user: true
                    }
                }
            },
            orderBy: { enrolledAt: 'desc' }
        });

        return { success: true, data: pendingPayments };
    } catch (error) {
        console.error("Error fetching pending payments:", error);
        return { error: "Failed to fetch pending payments" };
    }
}

export async function getAllEnrollments() {
    try {
        const enrollments = await prisma.enrollment.findMany({
            include: {
                course: true,
                student: {
                    include: {
                        user: true
                    }
                },
                verifiedBy: {
                    include: {
                        user: true
                    }
                }
            },
            orderBy: { enrolledAt: 'desc' }
        });

        return { success: true, data: enrollments };
    } catch (error) {
        console.error("Error fetching enrollments:", error);
        return { error: "Failed to fetch enrollments" };
    }
}

export async function getStudentEnrollments(studentId: string) {
    try {
        const enrollments = await prisma.enrollment.findMany({
            where: { studentId },
            include: {
                course: {
                    include: {
                        teachers: {
                            include: {
                                user: true
                            }
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

        return { success: true, data: enrollments };
    } catch (error) {
        console.error("Error fetching student enrollments:", error);
        return { error: "Failed to fetch enrollments" };
    }
}

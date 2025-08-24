"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

export async function createQuiz(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "TEACHER") {
        return { error: "Not authorized" };
    }

    const courseId = formData.get("courseId") as string;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string | null;

    try {
        // Verify teacher has access to this course
        const course = await prisma.course.findFirst({
            where: {
                id: courseId,
                teachers: {
                    some: {
                        userId: session.user.id
                    }
                }
            }
        });

        if (!course) {
            return { error: "Course not found or access denied" };
        }

        const quiz = await prisma.quiz.create({
            data: {
                title,
                description,
                courseId,
            },
        });

        revalidatePath(`/teacher/courses/${courseId}`);
        return { success: true, data: quiz };
    } catch (error) {
        console.error("Error creating quiz:", error);
        return { error: "Failed to create quiz" };
    }
}

export async function updateQuiz(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "TEACHER") {
        return { error: "Not authorized" };
    }

    const quizId = formData.get("quizId") as string;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string | null;
    const isActive = formData.get("isActive") === "true";

    try {
        // Verify teacher has access to this quiz's course
        const quiz = await prisma.quiz.findFirst({
            where: {
                id: quizId,
                course: {
                    teachers: {
                        some: {
                            userId: session.user.id
                        }
                    }
                }
            },
            include: {
                course: true
            }
        });

        if (!quiz) {
            return { error: "Quiz not found or access denied" };
        }

        const updatedQuiz = await prisma.quiz.update({
            where: { id: quizId },
            data: {
                title,
                description,
                isActive,
            },
        });

        revalidatePath(`/teacher/courses/${quiz.courseId}`);
        return { success: true, data: updatedQuiz };
    } catch (error) {
        console.error("Error updating quiz:", error);
        return { error: "Failed to update quiz" };
    }
}

export async function deleteQuiz(quizId: string) {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "TEACHER") {
        return { error: "Not authorized" };
    }

    try {
        // Verify teacher has access to this quiz's course
        const quiz = await prisma.quiz.findFirst({
            where: {
                id: quizId,
                course: {
                    teachers: {
                        some: {
                            userId: session.user.id
                        }
                    }
                }
            }
        });

        if (!quiz) {
            return { error: "Quiz not found or access denied" };
        }

        await prisma.quiz.delete({
            where: { id: quizId }
        });

        revalidatePath(`/teacher/courses/${quiz.courseId}`);
        return { success: true };
    } catch (error) {
        console.error("Error deleting quiz:", error);
        return { error: "Failed to delete quiz" };
    }
}

export async function createQuestion(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "TEACHER") {
        return { error: "Not authorized" };
    }

    const quizId = formData.get("quizId") as string;
    const question = formData.get("question") as string;
    const optionA = formData.get("optionA") as string;
    const optionB = formData.get("optionB") as string;
    const optionC = formData.get("optionC") as string;
    const optionD = formData.get("optionD") as string;
    const correctAnswer = formData.get("correctAnswer") as string;
    const order = parseInt(formData.get("order") as string) || 0;

    try {
        // Verify teacher has access to this quiz's course
        const quiz = await prisma.quiz.findFirst({
            where: {
                id: quizId,
                course: {
                    teachers: {
                        some: {
                            userId: session.user.id
                        }
                    }
                }
            },
            include: {
                course: true
            }
        });

        if (!quiz) {
            return { error: "Quiz not found or access denied" };
        }

        const newQuestion = await prisma.question.create({
            data: {
                question,
                optionA,
                optionB,
                optionC,
                optionD,
                correctAnswer,
                order,
                quizId,
            },
        });

        revalidatePath(`/teacher/courses/${quiz.courseId}`);
        return { success: true, data: newQuestion };
    } catch (error) {
        console.error("Error creating question:", error);
        return { error: "Failed to create question" };
    }
}

export async function updateQuestion(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "TEACHER") {
        return { error: "Not authorized" };
    }

    const questionId = formData.get("questionId") as string;
    const question = formData.get("question") as string;
    const optionA = formData.get("optionA") as string;
    const optionB = formData.get("optionB") as string;
    const optionC = formData.get("optionC") as string;
    const optionD = formData.get("optionD") as string;
    const correctAnswer = formData.get("correctAnswer") as string;
    const order = parseInt(formData.get("order") as string) || 0;

    try {
        // Verify teacher has access to this question's quiz's course
        const questionRecord = await prisma.question.findFirst({
            where: {
                id: questionId,
                quiz: {
                    course: {
                        teachers: {
                            some: {
                                userId: session.user.id
                            }
                        }
                    }
                }
            },
            include: {
                quiz: {
                    include: {
                        course: true
                    }
                }
            }
        });

        if (!questionRecord) {
            return { error: "Question not found or access denied" };
        }

        const updatedQuestion = await prisma.question.update({
            where: { id: questionId },
            data: {
                question,
                optionA,
                optionB,
                optionC,
                optionD,
                correctAnswer,
                order,
            },
        });

        revalidatePath(`/teacher/courses/${questionRecord.quiz.courseId}`);
        return { success: true, data: updatedQuestion };
    } catch (error) {
        console.error("Error updating question:", error);
        return { error: "Failed to update question" };
    }
}

export async function deleteQuestion(questionId: string) {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "TEACHER") {
        return { error: "Not authorized" };
    }

    try {
        // Verify teacher has access to this question's quiz's course
        const question = await prisma.question.findFirst({
            where: {
                id: questionId,
                quiz: {
                    course: {
                        teachers: {
                            some: {
                                userId: session.user.id
                            }
                        }
                    }
                }
            },
            include: {
                quiz: {
                    include: {
                        course: true
                    }
                }
            }
        });

        if (!question) {
            return { error: "Question not found or access denied" };
        }

        await prisma.question.delete({
            where: { id: questionId }
        });

        revalidatePath(`/teacher/courses/${question.quiz.courseId}`);
        return { success: true };
    } catch (error) {
        console.error("Error deleting question:", error);
        return { error: "Failed to delete question" };
    }
}

export async function getQuizById(quizId: string) {
    try {
        const quiz = await prisma.quiz.findUnique({
            where: { id: quizId },
            include: {
                course: {
                    include: {
                        teachers: {
                            include: {
                                user: true
                            }
                        }
                    }
                },
                questions: {
                    orderBy: { order: 'asc' }
                },
                _count: {
                    select: {
                        questions: true,
                        attempts: true
                    }
                }
            }
        });

        if (!quiz) {
            return { error: "Quiz not found" };
        }

        return { success: true, data: quiz };
    } catch (error) {
        console.error("Error fetching quiz:", error);
        return { error: "Failed to fetch quiz" };
    }
}

export async function submitQuizAttempt(
    quizId: string,
    studentId: string,
    answers: Record<string, string>
) {
    try {
        // Get quiz with questions
        const quiz = await prisma.quiz.findUnique({
            where: { id: quizId },
            include: {
                questions: true
            }
        });

        if (!quiz) {
            return { error: "Quiz not found" };
        }

        // Calculate score
        let score = 0;
        quiz.questions.forEach(question => {
            if (answers[question.id] === question.correctAnswer) {
                score++;
            }
        });

        const attempt = await prisma.quizAttempt.create({
            data: {
                quizId,
                studentId,
                score,
                totalQuestions: quiz.questions.length,
                answers,
            },
        });

        revalidatePath(`/profile/courses/${quiz.courseId}`);
        return { success: true, data: attempt };
    } catch (error) {
        console.error("Error submitting quiz attempt:", error);
        return { error: "Failed to submit quiz" };
    }
}

export async function getStudentQuizAttempts(studentId: string, quizId: string) {
    try {
        const attempts = await prisma.quizAttempt.findMany({
            where: {
                studentId,
                quizId
            },
            orderBy: { attemptedAt: 'desc' }
        });

        return { success: true, data: attempts };
    } catch (error) {
        console.error("Error fetching quiz attempts:", error);
        return { error: "Failed to fetch attempts" };
    }
}

"use server";
import prisma from "@/lib/prisma";

export async function createCourse(formData: FormData) {
    const semester = formData.get("semester") as string;
    const title = formData.get("title") as string;
    const fee = parseInt(formData.get("fee") as string, 10);
    const isActive = formData.get("isActive") === "true";
    const data = {
        semester,
        title,
        fee,
        isActive,
    };
    try {
        const response = await prisma.course.create({
            data: data,
        });
        console.log(response);
    } catch (e) {
        console.error(e);
    }
}

export async function updateCourse(formData: FormData) {
    const semester = formData.get("semester") as string;
    const title = formData.get("title") as string;
    const fee = parseInt(formData.get("fee") as string, 10);
    const isActive = formData.get("isActive") === "true";
    const data = {
        semester,
        title,
        fee,
        isActive,
    };
    try {
        const response = await prisma.course.update({
            where: { id: Number(formData.get("courseId")) },
            data: data,
        });
        console.log(response);
    } catch (e) {
        console.error(e);
    }
}

export async function deleteCourse(id: number) {
    try {
        const deletedCourse = await prisma.course.delete({
            where: { id: Number(id) },
        });
        return ({ deletedCourse, deleted: true });
    } catch (error) {
        console.error("Error deleting course:", error);
        return { error: "Failed to delete course" };
    }
}

export async function getAllCourse() {
    try {
        const courses = await prisma.course.findMany({
            // orderBy: { createdAt: 'desc' } // optional sorting
            // include: { students: true }, // if you want to include related students
        });

        if (courses.length === 0) {
            return { data: [], error: "No courses found" };
        }

        return { data: courses, error: null };
    } catch (error) {
        console.error("Error fetching courses:", error);
        return { data: null, error: "Internal server error" };
    }
}

export async function getBoughtCourses(studentId: number) {
    try {
        const studentWithCourses = await prisma.student.findUnique({
            where: {
                id: studentId
            },
            include: {
                courses: true // Include the courses relation
            }
        });

        if (!studentWithCourses) {
            return { error: "Student not found" };
        }

        return studentWithCourses.courses;
    } catch (error) {
        console.error("Error fetching courses:", error);
        return { error: "Internal server error" };
    }
}

export async function getCourseById(courseId: string) {
    try {
        const course = await prisma.course.findUnique({
            where: { id: parseInt(courseId) },
        });

        if (!course) {
            return { data: null, error: "Course not found" };
        }

        return { data: course, error: null };
    } catch (err) {
        console.error("Error fetching course by ID:", err);
        return { data: null, error: "Failed to fetch course" };
    }
}
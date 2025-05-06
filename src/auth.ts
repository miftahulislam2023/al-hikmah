import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { compare } from "bcryptjs";
import prisma from "./lib/prisma";

export const { handlers, signIn, signOut, auth: nextAuth } = NextAuth({
    // session: {
    //     strategy: "jwt",
    // },
    pages: {
        signIn: "/signin",
        error: "/error",
    },
    trustHost: true,
    providers: [
        Credentials({
            credentials: {
                email: {
                    label: "Email",
                    type: "email",
                    placeholder: "Enter your email",
                },
                password: {
                    label: "Password",
                    type: "password",
                    placeholder: "Enter your password",
                },
                role: {
                    label: "Role",
                    type: "select",
                    placeholder: "Select your role",
                    options: [
                        { label: "Student", value: "USER" },
                        { label: "Teacher", value: "TEACHER" }
                    ]
                }
            },
            authorize: async (credentials) => {
                const { email, password, role } = credentials as {
                    email: string;
                    password: string;
                    role: string;
                };

                // Check if user is a teacher
                if (role === "TEACHER") {
                    const teacher = await prisma.teacher.findUnique({
                        where: { email }
                    });

                    if (!teacher) {
                        throw new Error("Teacher not found.");
                    }

                    const passwordMatch = await compare(password, teacher.password || "");

                    if (!passwordMatch) {
                        throw new Error("Invalid credentials.");
                    }

                    return {
                        id: teacher.id.toString(),
                        name: teacher.name || "",
                        email: teacher.email,
                        phone: teacher.phone || "",
                        address: teacher.address || "",
                        dob: teacher.dob,
                        gender: teacher.gender || "",
                        currentInstitute: teacher.currentInstitute || "",
                        role: "TEACHER"
                    };
                }

                // Default: check if user is a student
                const student = await prisma.student.findUnique({
                    where: { email }
                });

                if (!student) {
                    throw new Error("Student not found.")
                }

                const passwordMatch = await compare(password, student.password);

                if (!passwordMatch) {
                    throw new Error("Invalid credentials.");
                }

                return {
                    id: student.id.toString(),
                    name: student.name || "",
                    email: student.email,
                    phone: student.phone || "",
                    sscBatch: student.sscBatch?.toString() || "",
                    address: student.address || "",
                    dob: student.dob,
                    gender: student.gender || "",
                    currentInstitute: student.currentInstitute || "",
                    currentClass: student.currentClass?.toString() || "",
                    roll: student.roll || "",
                    guardianName: student.guardianName || "",
                    guardianPhone: student.guardianPhone || "",
                    guardianOccupation: student.guardianOccupation || "",
                    role: student.role || "USER",
                }
            },

        }),

    ],
    callbacks: {
        jwt({ token, user }) {
            if (user) {
                // Common properties for all users
                token.id = user.id
                token.name = user.name
                token.email = user.email
                token.phone = user.phone
                token.address = user.address
                token.dob = user.dob
                token.gender = user.gender
                token.currentInstitute = user.currentInstitute
                token.role = user.role

                // Role-specific properties
                if (user.role === "TEACHER") {
                    // Teacher-specific properties (none additional right now)
                } else {
                    // Student-specific properties
                    token.sscBatch = user.sscBatch
                    token.currentClass = user.currentClass
                    token.roll = user.roll
                    token.guardianName = user.guardianName
                    token.guardianPhone = user.guardianPhone
                    token.guardianOccupation = user.guardianOccupation
                }
            }
            return token
        },
        session({ session, token }) {
            // Make sure session.user has the right type
            if (session.user) {
                // Common properties for all users
                session.user.id = token.id as string
                session.user.name = token.name as string
                session.user.email = token.email as string
                session.user.phone = token.phone as string
                session.user.address = token.address as string
                session.user.dob = token.dob as Date | null
                session.user.gender = token.gender as string
                session.user.currentInstitute = token.currentInstitute as string
                session.user.role = token.role as string

                // Role-specific properties
                if (token.role === "TEACHER") {
                    // Teacher-specific properties (none additional right now)
                } else {
                    // Student-specific properties
                    session.user.sscBatch = token.sscBatch as string
                    session.user.currentClass = token.currentClass as string
                    session.user.roll = token.roll as string
                    session.user.guardianName = token.guardianName as string
                    session.user.guardianPhone = token.guardianPhone as string
                    session.user.guardianOccupation = token.guardianOccupation as string
                }
            }
            return session
        },

    },

})

// Custom auth function that ensures fresh data
export async function auth() {
    const session = await nextAuth();

    // If there is a session and user ID, fetch the latest user data from DB
    if (session?.user?.id && session?.user?.role) {
        try {
            // For teacher role, get fresh teacher data
            if (session.user.role === "TEACHER") {
                const freshTeacherData = await prisma.teacher.findUnique({
                    where: { id: Number(session.user.id) },
                });

                if (freshTeacherData) {
                    // Update session with fresh teacher data
                    session.user = {
                        ...session.user,
                        id: freshTeacherData.id.toString(),
                        name: freshTeacherData.name || "",
                        email: freshTeacherData.email,
                        phone: freshTeacherData.phone || "",
                        address: freshTeacherData.address || "",
                        dob: freshTeacherData.dob,
                        gender: freshTeacherData.gender || "",
                        currentInstitute: freshTeacherData.currentInstitute || "",
                        role: "TEACHER",
                    };
                }
            }
            // For student role, get fresh student data
            else {
                const freshUserData = await prisma.student.findUnique({
                    where: { id: Number(session.user.id) },
                });

                if (freshUserData) {
                    // Update session with fresh student data
                    session.user = {
                        ...session.user,
                        id: freshUserData.id.toString(),
                        name: freshUserData.name || "",
                        email: freshUserData.email,
                        phone: freshUserData.phone || "",
                        sscBatch: freshUserData.sscBatch?.toString() || "",
                        address: freshUserData.address || "",
                        dob: freshUserData.dob,
                        gender: freshUserData.gender || "",
                        currentInstitute: freshUserData.currentInstitute || "",
                        currentClass: freshUserData.currentClass?.toString() || "",
                        roll: freshUserData.roll || "",
                        guardianName: freshUserData.guardianName || "",
                        guardianPhone: freshUserData.guardianPhone || "",
                        guardianOccupation: freshUserData.guardianOccupation || "",
                        role: freshUserData.role || "USER",
                    };
                }
            }
        } catch (error) {
            console.error("Error refreshing user data:", error);
        }
    }

    return session;
}
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { compare } from "bcryptjs";
import prisma from "./lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
    // session: {
    //     strategy: "jwt",
    // },
    pages: {
        signIn: "/profile/signin",
        error: "/profile/error",
    },
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
            },
            authorize: async (credentials) => {
                const { email, password } = credentials as {
                    email: string;
                    password: string;
                };

                const student = await prisma.student.findUnique({
                    where: {
                        email: email
                    }
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
                }
            },

        }),

    ],
    callbacks: {
        jwt({ token, user }) {
            if (user) {
                // Pass all user properties to the token
                token.id = user.id
                token.name = user.name
                token.email = user.email
                token.phone = user.phone
                token.roll = user.roll
                token.sscBatch = user.sscBatch
                token.address = user.address
                token.dob = user.dob
                token.gender = user.gender
                token.currentInstitute = user.currentInstitute
                token.currentClass = user.currentClass
                token.guardianName = user.guardianName
                token.guardianPhone = user.guardianPhone
                token.guardianOccupation = user.guardianOccupation
            }
            return token
        },
        session({ session, token }) {
            // Make sure session.user has the right type
            if (session.user) {
                session.user.id = token.id as string
                session.user.name = token.name as string
                session.user.email = token.email as string
                // Add additional properties to the session
                session.user.phone = token.phone as string
                session.user.roll = token.roll as string
                session.user.sscBatch = token.sscBatch as string
                session.user.address = token.address as string
                session.user.dob = token.dob as Date | null
                session.user.gender = token.gender as string
                session.user.currentInstitute = token.currentInstitute as string
                session.user.currentClass = token.currentClass as string
                session.user.guardianName = token.guardianName as string
                session.user.guardianPhone = token.guardianPhone as string
                session.user.guardianOccupation = token.guardianOccupation as string
            }
            return session
        },

    },

})
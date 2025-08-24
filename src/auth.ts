import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import { compare } from "bcryptjs";
import prisma from "./lib/prisma";
// import { PrismaAdapter } from "@auth/prisma-adapter"

export const { handlers, signIn, signOut, auth: nextAuth } = NextAuth({
    // adapter: PrismaAdapter(prisma),
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/signin",
        error: "/error",
    },
    trustHost: true,
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
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
                        { label: "Student", value: "STUDENT" },
                        { label: "Teacher", value: "TEACHER" },
                        { label: "Admin", value: "ADMIN" }
                    ]
                }
            },
            authorize: async (credentials) => {
                const { email, password, role } = credentials as {
                    email: string;
                    password: string;
                    role: string;
                };

                // Find user by email
                const user = await prisma.user.findUnique({
                    where: { email },
                    include: {
                        student: true,
                        teacher: true,
                        admin: true,
                    }
                });

                if (!user || !user.password) {
                    throw new Error("User not found.");
                }

                // Check if role matches
                if (user.role !== role) {
                    throw new Error("Invalid role selected.");
                }

                const passwordMatch = await compare(password, user.password);

                if (!passwordMatch) {
                    throw new Error("Invalid credentials.");
                }

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    image: user.image,
                    role: user.role,
                };
            },
        }),
    ],
    callbacks: {
        async signIn({ user, account }) {
            if (account?.provider === "google") {
                // For Google sign-in, check if user exists
                const existingUser = await prisma.user.findUnique({
                    where: { email: user.email! }
                });

                if (!existingUser) {
                    // Create new user with STUDENT role by default
                    // Admin users should be created manually
                    const newUser = await prisma.user.create({
                        data: {
                            email: user.email!,
                            name: user.name,
                            image: user.image,
                            role: "STUDENT",
                            emailVerified: new Date(),
                        }
                    });

                    // Create student profile
                    await prisma.student.create({
                        data: {
                            userId: newUser.id,
                        }
                    });
                }
            }
            return true;
        },
        async jwt({ token, user }) {
            if (user) {
                // If we have a user object but no role (Google sign-in case)
                if (!user.role && user.email) {
                    // Fetch the user from database
                    const dbUser = await prisma.user.findUnique({
                        where: { email: user.email }
                    });

                    if (dbUser) {
                        token.id = dbUser.id; // Use database user ID, not Google ID
                        token.role = dbUser.role;
                    }
                } else {
                    // Normal case (credentials sign-in)
                    token.id = user.id;
                    token.role = user.role;
                }
            }

            // For subsequent calls (when user is undefined), preserve existing token data
            // but ensure we have the role if it's missing
            if (!token.role && token.email) {
                const dbUser = await prisma.user.findUnique({
                    where: { email: token.email as string }
                });

                if (dbUser) {
                    token.id = dbUser.id;
                    token.role = dbUser.role;
                }
            }

            return token;
        },
        async session({ session, token }) {
            if (token.id) {
                // Fetch fresh user data with related profiles
                const user = await prisma.user.findUnique({
                    where: { id: token.id as string },
                    include: {
                        student: true,
                        teacher: true,
                        admin: true,
                    }
                });

                if (user) {
                    session.user.id = user.id;
                    session.user.role = user.role;
                    session.user.name = user.name;
                    session.user.email = user.email;
                    session.user.image = user.image;

                    // Add role-specific data
                    if (user.role === "STUDENT" && user.student) {
                        session.user.studentId = user.student.id;
                        session.user.sscBatch = user.student.sscBatch;
                        session.user.address = user.student.address;
                        session.user.dob = user.student.dob;
                        session.user.gender = user.student.gender;
                        session.user.currentInstitute = user.student.currentInstitute;
                        session.user.currentClass = user.student.currentClass;
                        session.user.roll = user.student.roll;
                        session.user.guardianName = user.student.guardianName;
                        session.user.guardianPhone = user.student.guardianPhone;
                        session.user.guardianOccupation = user.student.guardianOccupation;
                    } else if (user.role === "TEACHER" && user.teacher) {
                        session.user.teacherId = user.teacher.id;
                        session.user.address = user.teacher.address;
                        session.user.dob = user.teacher.dob;
                        session.user.gender = user.teacher.gender;
                        session.user.currentInstitute = user.teacher.currentInstitute;
                        session.user.specialization = user.teacher.specialization;
                        session.user.experience = user.teacher.experience;
                    } else if (user.role === "ADMIN" && user.admin) {
                        session.user.adminId = user.admin.id;
                    }
                }
            }
            return session;
        },
    },
});

// Custom auth function (keeping the same name for backward compatibility)
export async function auth() {
    return await nextAuth();
}
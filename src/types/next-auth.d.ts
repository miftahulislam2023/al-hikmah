import { DefaultSession } from "next-auth"
import { Role, Gender, Class } from "@prisma/client"

declare module "next-auth" {
    /**
     * Extend the built-in session types
     */
    interface Session {
        user: {
            id: string
            role: Role
            phone?: string | null

            // Student-specific properties
            studentId?: string
            sscBatch?: number | null
            address?: string | null
            dob?: Date | null
            gender?: Gender | null
            currentInstitute?: string | null
            currentClass?: Class | null
            roll?: string | null
            guardianName?: string | null
            guardianPhone?: string | null
            guardianOccupation?: string | null

            // Teacher-specific properties
            teacherId?: string
            specialization?: string | null
            experience?: number | null

            // Admin-specific properties
            adminId?: string
        } & DefaultSession["user"]
    }

    /**
     * Extend the built-in user types
     */
    interface User {
        id: string
        role: Role
        phone?: string | null
    }
}

declare module "next-auth/jwt" {
    /** Extend the built-in JWT types */
    interface JWT {
        id: string
        role: Role
    }
}
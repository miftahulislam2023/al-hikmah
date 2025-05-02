import { DefaultSession } from "next-auth"

declare module "next-auth" {
    /**
     * Extend the built-in session types
     */
    interface Session {
        user: {
            id: string
            name: string
            email: string
            phone: string
            roll: string
            sscBatch: string
            address: string
            dob: Date | null
            gender: string
            currentInstitute: string
            currentClass: string
            guardianName: string
            guardianPhone: string
            guardianOccupation: string
        } & DefaultSession["user"]
    }

    /**
     * Extend the built-in user types
     */
    interface User {
        id: string
        name: string
        email: string
        phone: string
        roll: string
        sscBatch: string
        address: string
        dob: Date | null
        gender: string
        currentInstitute: string
        currentClass: string
        guardianName: string
        guardianPhone: string
        guardianOccupation: string
    }
}

declare module "next-auth/jwt" {
    /** Extend the built-in JWT types */
    interface JWT {
        id: string
        name: string
        email: string
        phone: string
        roll: string
        sscBatch: string
        address: string
        dob: Date | null
        gender: string
        currentInstitute: string
        currentClass: string
        guardianName: string
        guardianPhone: string
        guardianOccupation: string
    }
}
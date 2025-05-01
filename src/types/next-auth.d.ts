// Declaration file to extend NextAuth types
import { Gender, Class, Role } from "../lib/types";

declare module "next-auth" {
    interface User {
        id: string;
        name: string;
        email: string;
        phone?: string;
        roll?: string;
        sscBatch?: string;
        address?: string;
        dob?: Date | null;
        gender?: string;
        currentInstitute?: string;
        currentClass?: string;
        guardianName?: string;
        guardianPhone?: string;
        guardianOccupation?: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        name: string;
        email: string;
        phone?: string;
        roll?: string;
        sscBatch?: string;
        address?: string;
        dob?: Date | null;
        gender?: string;
        currentInstitute?: string;
        currentClass?: string;
        guardianName?: string;
        guardianPhone?: string;
        guardianOccupation?: string;
    }
}

declare module "next-auth/core/types" {
    interface Session {
        user: {
            id: string;
            name: string;
            email: string;
            phone?: string;
            roll?: string;
            sscBatch?: string;
            address?: string;
            dob?: Date | null;
            gender?: string;
            currentInstitute?: string;
            currentClass?: string;
            guardianName?: string;
            guardianPhone?: string;
            guardianOccupation?: string;
        }
    }
}
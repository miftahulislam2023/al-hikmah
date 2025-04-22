// Import Prisma types to ensure alignment
import { Gender as PrismaGender, Class as PrismaClass, Role as PrismaRole } from "@prisma/client";

export interface Course {
    id: number;
    semester: string;
    title: string;
    fee: number;
    isActive: boolean;
    createdAt: Date | string; // Allow both Date and string to handle different sources
    updatedAt: Date | string; // Allow both Date and string to handle different sources
}

// Use the same enum types as Prisma
export type Gender = PrismaGender;
export type Class = PrismaClass;
export type Role = PrismaRole;

export interface Student {
    id: number;
    name: string | null;
    email: string;
    phone: string | null;
    password?: string | null;
    sscBatch: number | null;
    address: string | null;
    dob: Date | null;
    gender: Gender | null;
    currentInstitute: string | null;
    currentClass: Class;
    roll: string | null;
    role: Role;
    guardianName: string | null;
    guardianPhone: string | null;
    guardianOccupation: string | null;
    createdAt: Date;
    updatedAt: Date;
    courses: Course[];
}

export interface StudentResponse {
    error?: string;
    id?: number;
    name?: string | null;
    email?: string;
    phone?: string | null;
    sscBatch?: number | null;
    address?: string | null;
    dob?: Date | null;
    gender?: Gender | null;
    currentInstitute?: string | null;
    currentClass?: Class;
    roll?: string | null;
    role?: Role;
    guardianName?: string | null;
    guardianPhone?: string | null;
    guardianOccupation?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
    courses?: Course[];
}

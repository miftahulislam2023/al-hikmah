"use client";

import { useFormStatus } from "react-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { searchStudentByEmail } from "@/actions/student";
import { useActionState, useState } from "react";
import Info from "./Info";
import Link from "next/link";
import { Course, StudentResponse } from "@/lib/types";

export default function SearchForm() {
    const { pending } = useFormStatus();

    // Create a wrapper function with the correct signature for useActionState
    const searchStudentWrapper = async (state: StudentResponse, formData: FormData) => {
        return searchStudentByEmail(formData, formData);
    };

    const [state, formAction] = useActionState<StudentResponse, FormData>(searchStudentWrapper, null);
    const [student, setStudent] = useState<StudentResponse | null>(null);

    // sync response from server into state
    if (state && !("error" in state) && state !== student) {
        console.log("Student found:", state);
        setStudent(state);
    }

    return (
        <form action={formAction} className="space-y-6">
            <div className="flex gap-2">
                <Input type="text" name="email" placeholder="Enter student's email" required />
                <Button type="submit" disabled={pending}>
                    {pending ? "Searching..." : "Search"}
                </Button>
            </div>

            {state?.error && <p className="text-red-500 text-sm">{state.error}</p>}

            {student && !state?.error && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mt-6">
                    <Info label="Name" value={student.name} />
                    <Info label="Email" value={student.email} />
                    <Info label="Phone" value={student.phone} />
                    <Info label="Gender" value={student.gender} />
                    <Info label="DOB" value={new Date(student.dob).toDateString()} />
                    <Info label="Class" value={student.currentClass} />
                    <Info label="Institute" value={student.currentInstitute} />
                    <Info label="SSC Batch" value={student.sscBatch} />
                    <Info label="Roll" value={student.roll} />
                    <Info label="Guardian Name" value={student.guardianName} />
                    <Info label="Guardian Phone" value={student.guardianPhone} />
                    <Info label="Guardian Occupation" value={student.guardianOccupation} />
                    <Info label="Address" value={student.address} />
                    <Info label="Created At" value={new Date(student.createdAt).toLocaleString()} />
                    <Info label="Updated At" value={new Date(student.updatedAt).toLocaleString()} />
                    <Link href={`/admin/students/${student.email}`} className="sm:col-span-2">
                        <Button>Update Profile</Button>
                    </Link>
                    <div className="sm:col-span-2 mt-4">
                        <h3 className="font-semibold text-base mb-2">Courses</h3>
                        {student.courses && student.courses.length > 0 ? (
                            <ul className="space-y-2">
                                {student.courses.map((course: Course) => (
                                    <li key={course.id} className="border p-3 rounded-md bg-gray-50 shadow-sm">
                                        <p><strong>Title:</strong> {course.title}</p>
                                        <p><strong>Semester:</strong> {course.semester}</p>
                                        <p><strong>Fee:</strong> ৳{course.fee}</p>
                                        <p><strong>Status:</strong> {course.isActive ? "Active" : "Inactive"}</p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No courses enrolled.</p>
                        )}
                    </div>
                </div>
            )}
        </form>
    );
}

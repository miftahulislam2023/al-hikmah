import { updateStudent, addCourseToStudent, removeCourseFromStudent, getStudentByEmail } from "@/actions/student";
import { getAllCourse } from "@/actions/course";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import Form from "next/form";
import { Course } from "@/lib/types";
// Import Class from Prisma client directly to get both the type and value
import { Class } from "@prisma/client";

export default async function Page({ params }: { params: { studentEmail: string } }) {
    const { studentEmail } = (await params);
    const student = await getStudentByEmail(studentEmail);
    if (!student || 'error' in student) {
        return <p className="text-red-500 text-sm">Student not found</p>;
    }
    const allCourses = (await getAllCourse()).data as Course[];
    const studentCourses = student.courses || [];
    const availableCourses = allCourses.filter(
        (course: Course) => !studentCourses.some((sc: Course) => sc.id === course.id)
    );

    // Create an array of Class enum values for the dropdown
    const classValues = Object.values(Class);

    return (
        <div className="max-w-xl mx-auto mt-10 space-y-6">
            <h1 className="text-2xl font-bold">Update Student Info</h1>

            {/* Student Update Form */}
            <form action={updateStudent} className="space-y-4 py-2">
                <Input type="hidden" name="id" value={student.id} />

                <div className="space-y-1">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" name="name" defaultValue={student.name || ''} required />
                </div>

                <div className="space-y-1">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" defaultValue={student.email} required />
                </div>

                <div className="space-y-1">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" name="phone" defaultValue={student.phone || ''} required />
                </div>

                <div className="space-y-1">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" name="address" defaultValue={student.address || ''} required />
                </div>

                <div className="space-y-1">
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Input
                        id="dob"
                        name="dob"
                        type="date"
                        defaultValue={student.dob ? new Date(student.dob).toISOString().split("T")[0] : ""}
                        required
                    />
                </div>

                <div className="space-y-1">
                    <Label htmlFor="gender">Gender</Label>
                    <Select name="gender" defaultValue={student.gender || ""} required>
                        <SelectTrigger id="gender">
                            <SelectValue placeholder="Select Gender" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="MALE">Male</SelectItem>
                            <SelectItem value="FEMALE">Female</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-1">
                    <Label htmlFor="currentInstitute">Current Institute</Label>
                    <Input id="currentInstitute" name="currentInstitute" defaultValue={student.currentInstitute || ''} required />
                </div>

                <div className="space-y-1">
                    <Label htmlFor="currentClass">Current Class</Label>
                    <Select name="currentClass" defaultValue={student.currentClass || ""} required>
                        <SelectTrigger id="currentClass">
                            <SelectValue placeholder="Select Class" />
                        </SelectTrigger>
                        <SelectContent>
                            {classValues.map((cls) => (
                                <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-1">
                    <Label htmlFor="sscBatch">SSC Batch</Label>
                    <Input
                        id="sscBatch"
                        name="sscBatch"
                        type="number"
                        defaultValue={student.sscBatch?.toString() || ''}
                        required
                    />
                </div>

                <div className="space-y-1">
                    <Label htmlFor="guardianName">Guardian Name</Label>
                    <Input id="guardianName" name="guardianName" defaultValue={student.guardianName || ''} required />
                </div>

                <div className="space-y-1">
                    <Label htmlFor="guardianPhone">Guardian Phone</Label>
                    <Input id="guardianPhone" name="guardianPhone" defaultValue={student.guardianPhone || ''} required />
                </div>

                <div className="space-y-1">
                    <Label htmlFor="guardianOccupation">Guardian Occupation</Label>
                    <Input id="guardianOccupation" name="guardianOccupation" defaultValue={student.guardianOccupation || ''} required />
                </div>

                <Button type="submit" className="w-full">
                    Update Student
                </Button>
            </form>

            {/* Student Courses Section */}
            <div className="mb-10">
                <h2 className="text-xl font-bold mb-2">Student Courses</h2>
                <ul className="mb-4 space-y-2">
                    {studentCourses.length === 0 && <li className="text-gray-500">No courses assigned.</li>}
                    {studentCourses.map((course: Course) => (
                        <li key={course.id} className="flex items-center justify-between border rounded px-3 py-2">
                            <span>{course.title}</span>
                            <form action={async () => {
                                'use server';
                                await removeCourseFromStudent(student.id, course.id);
                            }}>
                                <Button type="submit" size="sm" variant="destructive">Remove</Button>
                            </form>
                        </li>
                    ))}
                </ul>
                {availableCourses.length > 0 && (
                    <Form action={async (formData: FormData) => {
                        'use server';
                        const courseId = Number(formData.get('courseId'));
                        await addCourseToStudent(student.id, courseId);
                    }} className="flex gap-2 items-center">
                        <Select name="courseId" required>
                            <SelectTrigger className="w-48">
                                <SelectValue placeholder="Select course to add" />
                            </SelectTrigger>
                            <SelectContent>
                                {availableCourses.map((course: Course) => (
                                    <SelectItem key={course.id} value={String(course.id)}>
                                        {course.title}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button type="submit" size="sm">Add Course</Button>
                    </Form>
                )}
            </div>
        </div>
    );
}

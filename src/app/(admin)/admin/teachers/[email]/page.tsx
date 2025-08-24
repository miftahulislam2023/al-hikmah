import { getTeacherByEmail, updateTeacher } from "@/actions/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

interface EditTeacherPageProps {
    params: {
        email: string;
    };
}

export default async function EditTeacherPage({ params }: EditTeacherPageProps) {
    const session = await auth();
    if (!session || session.user?.role !== "ADMIN") {
        redirect("/signin");
    }

    const { email } = await params;
    const decodedEmail = decodeURIComponent(email);

    const { data: teacher, error } = await getTeacherByEmail(decodedEmail);

    if (error || !teacher) {
        return (
            <div className="container mx-auto p-6">
                <h1 className="text-2xl font-bold text-red-600 mb-4">Teacher Not Found</h1>
                <p className="text-red-500 mb-4">{error || "The requested teacher could not be found."}</p>
                <Link href="/admin/teachers">
                    <Button variant="outline">← Back to Teachers</Button>
                </Link>
            </div>
        );
    }

    async function handleUpdateTeacher(formData: FormData) {
        "use server";
        const result = await updateTeacher(teacher.id, formData);

        if (result.error) {
            // In a real app, you'd handle this error properly
            throw new Error(result.error);
        }

        // Redirect back to teachers list
        redirect("/admin/teachers");
    }

    return (
        <div className="container mx-auto p-6 max-w-4xl">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Edit Teacher</h1>
                    <p className="text-gray-600">Update teacher information</p>
                </div>
                <Link href="/admin/teachers">
                    <Button variant="outline">← Back to Teachers</Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Teacher Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <form action={handleUpdateTeacher} className="space-y-6">
                        {/* Basic Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name *</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    defaultValue={teacher.user.name || ""}
                                    placeholder="Teacher's full name"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address *</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    defaultValue={teacher.user.email}
                                    placeholder="teacher@example.com"
                                    required
                                    disabled
                                    className="bg-gray-100"
                                />
                                <p className="text-xs text-gray-500">Email cannot be changed</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    defaultValue={teacher.user.phone || ""}
                                    placeholder="+8801XXXXXXXXX"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="dob">Date of Birth</Label>
                                <Input
                                    id="dob"
                                    name="dob"
                                    type="date"
                                    defaultValue={teacher.dob ? new Date(teacher.dob).toISOString().split('T')[0] : ""}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="gender">Gender</Label>
                                <Select name="gender" defaultValue={teacher.gender || undefined}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select gender" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="MALE">Male</SelectItem>
                                        <SelectItem value="FEMALE">Female</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="experience">Years of Experience</Label>
                                <Input
                                    id="experience"
                                    name="experience"
                                    type="number"
                                    defaultValue={teacher.experience || ""}
                                    placeholder="0"
                                    min="0"
                                    max="50"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="address">Address</Label>
                            <Textarea
                                id="address"
                                name="address"
                                defaultValue={teacher.address || ""}
                                placeholder="Full address"
                                rows={3}
                            />
                        </div>

                        {/* Professional Information */}
                        <div className="border-t pt-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Professional Details</h3>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="currentInstitute">Current Institute</Label>
                                    <Input
                                        id="currentInstitute"
                                        name="currentInstitute"
                                        defaultValue={teacher.currentInstitute || ""}
                                        placeholder="Previous/Current workplace"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="specialization">Specialization/Subject Areas</Label>
                                    <Textarea
                                        id="specialization"
                                        name="specialization"
                                        defaultValue={teacher.specialization || ""}
                                        placeholder="Mathematics, Physics, English, etc."
                                        rows={3}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Account Information */}
                        <div className="border-t pt-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Account Status</h3>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="font-medium text-gray-700">Account Created:</span>
                                        <p className="text-gray-600">{new Date(teacher.user.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-700">Last Updated:</span>
                                        <p className="text-gray-600">{new Date(teacher.user.updatedAt).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-700">Total Courses:</span>
                                        <p className="text-gray-600">{teacher._count?.courses || 0} assigned</p>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-700">User ID:</span>
                                        <p className="text-gray-600 font-mono text-xs">{teacher.user.id}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Submit Buttons */}
                        <div className="flex gap-4 pt-6">
                            <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
                                Update Teacher
                            </Button>
                            <Link
                                href="/admin/teachers"
                                className="px-8 py-2 text-center border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

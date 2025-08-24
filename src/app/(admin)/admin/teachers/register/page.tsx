import { createTeacher } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Textarea } from "@/components/ui/textarea";

export default async function RegisterTeacherPage() {
    const session = await auth();
    if (!session || session.user?.role !== "ADMIN") {
        redirect("/signin");
    }

    async function handleRegisterTeacher(formData: FormData) {
        "use server";
        const result = await createTeacher(formData);

        if (result.error) {
            // In a real app, you'd handle this error properly
            throw new Error(result.error);
        }

        // Redirect to teachers list or show success
        redirect("/admin/teachers");
    }

    return (
        <div className="container mx-auto p-6 max-w-4xl">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Register New Teacher</h1>
                    <p className="text-gray-600">Add a new teacher to the system</p>
                </div>
                <Link
                    href="/admin/teachers"
                    className="px-4 py-2 text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition-colors"
                >
                    View All Teachers
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Teacher Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <form action={handleRegisterTeacher} className="space-y-6">
                        {/* Basic Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name *</Label>
                                <Input
                                    id="name"
                                    name="name"
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
                                    placeholder="teacher@example.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="password">Password *</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="Strong password"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    placeholder="+8801XXXXXXXXX"
                                />
                            </div>
                        </div>

                        {/* Personal Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="dob">Date of Birth</Label>
                                <Input
                                    id="dob"
                                    name="dob"
                                    type="date"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="gender">Gender</Label>
                                <Select name="gender">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select gender" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="MALE">Male</SelectItem>
                                        <SelectItem value="FEMALE">Female</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="address">Address</Label>
                            <Textarea
                                id="address"
                                name="address"
                                placeholder="Full address"
                                rows={3}
                            />
                        </div>

                        {/* Professional Information */}
                        <div className="border-t pt-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Professional Details</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="currentInstitute">Current Institute</Label>
                                    <Input
                                        id="currentInstitute"
                                        name="currentInstitute"
                                        placeholder="Previous/Current workplace"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="experience">Years of Experience</Label>
                                    <Input
                                        id="experience"
                                        name="experience"
                                        type="number"
                                        placeholder="0"
                                        min="0"
                                        max="50"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2 mt-4">
                                <Label htmlFor="specialization">Specialization/Subject Areas</Label>
                                <Textarea
                                    id="specialization"
                                    name="specialization"
                                    placeholder="Mathematics, Physics, English, etc."
                                    rows={3}
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex gap-4 pt-6">
                            <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700">
                                Register Teacher
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

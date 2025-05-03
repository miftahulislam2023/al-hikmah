import { updateStudentProfile } from "@/actions/student";
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Class } from "@prisma/client";
import Form from "next/form";
import { Card } from "@/components/ui/card";

export default async function EditProfile() {
    const session = await auth()
    const user = session.user;
    const classValues = Object.values(Class);
    return (
        <div className="max-w-4xl mx-auto my-8">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-t-lg shadow-lg">
                <h1 className="text-3xl font-bold text-white text-center">My Profile</h1>
                <p className="text-white text-center mt-2">Update your information here</p>
            </div>

            <Card className="p-6 rounded-b-lg shadow-lg border-t-0">
                {/* user Update Form */}
                <Form
                    action={async (formData) => {
                        "use server"
                        await updateStudentProfile(formData);
                    }}
                    className="space-y-5"
                >
                    <Input type="hidden" name="id" value={user.id} />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-lg font-medium">Name</Label>
                            <Input
                                id="name"
                                name="name"
                                defaultValue={user.name || ''}
                                required
                                className="p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-lg font-medium">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                defaultValue={user.email}
                                required
                                className="p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone" className="text-lg font-medium">Phone</Label>
                            <Input
                                id="phone"
                                name="phone"
                                defaultValue={user.phone || ''}
                                required
                                className="p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="dob" className="text-lg font-medium">Date of Birth</Label>
                            <Input
                                id="dob"
                                name="dob"
                                type="date"
                                defaultValue={user.dob ? new Date(user.dob).toISOString().split("T")[0] : ""}
                                required
                                className="p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="gender" className="text-lg font-medium">Gender</Label>
                            <Select name="gender" defaultValue={user.gender || ""} required>
                                <SelectTrigger id="gender" className="p-3 rounded-lg focus:ring-2 focus:ring-blue-500">
                                    <SelectValue placeholder="Select Gender" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="MALE">Male</SelectItem>
                                    <SelectItem value="FEMALE">Female</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="currentClass" className="text-lg font-medium">Current Class</Label>
                            <Select name="currentClass" defaultValue={user.currentClass || ""} required>
                                <SelectTrigger id="currentClass" className="p-3 rounded-lg focus:ring-2 focus:ring-blue-500">
                                    <SelectValue placeholder="Select Class" />
                                </SelectTrigger>
                                <SelectContent>
                                    {classValues.map((cls) => (
                                        <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="currentInstitute" className="text-lg font-medium">Current Institute</Label>
                            <Input
                                id="currentInstitute"
                                name="currentInstitute"
                                defaultValue={user.currentInstitute || ''}
                                required
                                className="p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="sscBatch" className="text-lg font-medium">SSC Batch</Label>
                            <Input
                                id="sscBatch"
                                name="sscBatch"
                                type="number"
                                defaultValue={user.sscBatch?.toString() || ''}
                                required
                                className="p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div className="space-y-2 mt-4">
                        <Label htmlFor="address" className="text-lg font-medium">Address</Label>
                        <Input
                            id="address"
                            name="address"
                            defaultValue={user.address || ''}
                            required
                            className="p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg mt-4">
                        <h2 className="text-xl font-bold text-blue-700 mb-4">Guardian Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="guardianName" className="text-lg font-medium">Guardian Name</Label>
                                <Input
                                    id="guardianName"
                                    name="guardianName"
                                    defaultValue={user.guardianName || ''}
                                    required
                                    className="p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="guardianPhone" className="text-lg font-medium">Guardian Phone</Label>
                                <Input
                                    id="guardianPhone"
                                    name="guardianPhone"
                                    defaultValue={user.guardianPhone || ''}
                                    required
                                    className="p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="guardianOccupation" className="text-lg font-medium">Guardian Occupation</Label>
                                <Input
                                    id="guardianOccupation"
                                    name="guardianOccupation"
                                    defaultValue={user.guardianOccupation || ''}
                                    required
                                    className="p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-lg text-lg font-bold shadow-lg transition-all duration-300 hover:shadow-xl"
                    >
                        Save My Information
                    </Button>
                </Form>
            </Card>
        </div>
    )
}
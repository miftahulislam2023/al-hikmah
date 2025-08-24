import { updateStudentProfile } from "@/actions/user";
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
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg shadow-lg">
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
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                name="name"
                                defaultValue={user.name || ''}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                defaultValue={user.email}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                                id="phone"
                                name="phone"
                                defaultValue={user.phone || ''}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="dob">Date of Birth</Label>
                            <Input
                                id="dob"
                                name="dob"
                                type="date"
                                defaultValue={user.dob ? new Date(user.dob).toISOString().split("T")[0] : ""}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="gender">Gender</Label>
                            <Select name="gender" defaultValue={user.gender || ""} required>
                                <SelectTrigger id="gender">
                                    <SelectValue placeholder="Select Gender" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="MALE">Male</SelectItem>
                                    <SelectItem value="FEMALE">Female</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="currentClass">Current Class</Label>
                            <Select name="currentClass" defaultValue={user.currentClass || ""} required>
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

                        <div className="space-y-2">
                            <Label htmlFor="currentInstitute">Current Institute</Label>
                            <Input
                                id="currentInstitute"
                                name="currentInstitute"
                                defaultValue={user.currentInstitute || ''}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="sscBatch">SSC Batch</Label>
                            <Input
                                id="sscBatch"
                                name="sscBatch"
                                type="number"
                                defaultValue={user.sscBatch?.toString() || ''}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2 mt-4">
                        <Label htmlFor="address">Address</Label>
                        <Input
                            id="address"
                            name="address"
                            defaultValue={user.address || ''}
                            required
                        />
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg mt-4">
                        <h2 className="text-xl font-bold text-blue-700 mb-4">Guardian Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="guardianName">Guardian Name</Label>
                                <Input
                                    id="guardianName"
                                    name="guardianName"
                                    defaultValue={user.guardianName || ''}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="guardianPhone">Guardian Phone</Label>
                                <Input
                                    id="guardianPhone"
                                    name="guardianPhone"
                                    defaultValue={user.guardianPhone || ''}
                                    required
                                />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="guardianOccupation">Guardian Occupation</Label>
                                <Input
                                    id="guardianOccupation"
                                    name="guardianOccupation"
                                    defaultValue={user.guardianOccupation || ''}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full mt-6"
                    >
                        Save My Information
                    </Button>
                </Form>
            </Card>
        </div>
    )
}
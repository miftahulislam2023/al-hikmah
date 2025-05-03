import { updateStudentProfile } from "@/actions/student";
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Class } from "@prisma/client";
import Form from "next/form";

export default async function EditProfile() {
    const session = await auth()
    const user = session.user;
    const classValues = Object.values(Class);
    return (
        <div className="max-w-xl mx-auto mt-10 space-y-6">
            <h1 className="text-2xl font-bold">Update Your Info</h1>

            {/* user Update Form */}
            <Form
                action={async (formData) => {
                    "use server"
                    await updateStudentProfile(formData);
                }}
                className="space-y-4 py-2"
            >
                <Input type="hidden" name="id" value={user.id} />

                <div className="space-y-1">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" name="name" defaultValue={user.name || ''} required />
                </div>

                <div className="space-y-1">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" defaultValue={user.email} required />
                </div>

                <div className="space-y-1">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" name="phone" defaultValue={user.phone || ''} required />
                </div>

                <div className="space-y-1">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" name="address" defaultValue={user.address || ''} required />
                </div>

                <div className="space-y-1">
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Input
                        id="dob"
                        name="dob"
                        type="date"
                        defaultValue={user.dob ? new Date(user.dob).toISOString().split("T")[0] : ""}
                        required
                    />
                </div>

                <div className="space-y-1">
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

                <div className="space-y-1">
                    <Label htmlFor="currentInstitute">Current Institute</Label>
                    <Input id="currentInstitute" name="currentInstitute" defaultValue={user.currentInstitute || ''} required />
                </div>

                <div className="space-y-1">
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

                <div className="space-y-1">
                    <Label htmlFor="sscBatch">SSC Batch</Label>
                    <Input
                        id="sscBatch"
                        name="sscBatch"
                        type="number"
                        defaultValue={user.sscBatch?.toString() || ''}
                        required
                    />
                </div>

                <div className="space-y-1">
                    <Label htmlFor="guardianName">Guardian Name</Label>
                    <Input id="guardianName" name="guardianName" defaultValue={user.guardianName || ''} required />
                </div>

                <div className="space-y-1">
                    <Label htmlFor="guardianPhone">Guardian Phone</Label>
                    <Input id="guardianPhone" name="guardianPhone" defaultValue={user.guardianPhone || ''} required />
                </div>

                <div className="space-y-1">
                    <Label htmlFor="guardianOccupation">Guardian Occupation</Label>
                    <Input id="guardianOccupation" name="guardianOccupation" defaultValue={user.guardianOccupation || ''} required />
                </div>

                <Button type="submit" className="w-full">
                    Update Info
                </Button>
            </Form>
        </div>
    )
}
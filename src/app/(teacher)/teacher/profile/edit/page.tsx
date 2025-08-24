import { updateTeacherProfile } from "@/actions/user";
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import Form from "next/form";

export default async function EditTeacherProfile() {
    const session = await auth();
    const user = session.user;

    return (
        <div className="max-w-4xl mx-auto my-8">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold text-white text-center">My Profile</h1>
                <p className="text-white text-center mt-2">Update your information here</p>
            </div>

            <Card className="p-6 rounded-b-lg shadow-lg border-t-0">
                {/* Teacher Update Form */}
                <Form
                    action={async (formData) => {
                        "use server"
                        await updateTeacherProfile(formData);
                    }}
                    className="space-y-5"
                >
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
                                disabled
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
                            <Label htmlFor="currentInstitute">Current Institute</Label>
                            <Input
                                id="currentInstitute"
                                name="currentInstitute"
                                defaultValue={user.currentInstitute || ''}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="address">Address</Label>
                            <Input
                                id="address"
                                name="address"
                                defaultValue={user.address || ''}
                                required
                            />
                        </div>
                    </div>

                    <div className="flex justify-end space-x-4 mt-6">
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                            Update Profile
                        </Button>
                    </div>
                </Form>
            </Card>
        </div>
    );
}
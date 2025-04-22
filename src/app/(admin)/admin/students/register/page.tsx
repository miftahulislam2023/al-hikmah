import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Form from "next/form";
import { registerStudent } from "@/actions/student";

export default function RegisterStudent() {

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-md p-6 shadow-lg">
                <CardHeader>
                    <CardTitle className="text-center">Create Student</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form action={registerStudent} className="space-y-4">
                        <Label>Name</Label>
                        <Input id="name" type="text" name="name" placeholder="Enter name" required />

                        <Label>Address</Label>
                        <Input id="address" type="text" name="address" placeholder="Enter address" required />

                        <Label>Phone</Label>
                        <Input id="phone" type="text" name="phone" placeholder="Enter phone number" required />

                        <Label>Email</Label>
                        <Input id="email" type="email" name="email" placeholder="Enter email" required />

                        <Label>Date of Birth</Label>
                        <Input id="dob" type="date" name="dob" required />

                        <Label>Gender</Label>
                        <Select name="gender" required>
                            <SelectTrigger>
                                <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="MALE">Male</SelectItem>
                                <SelectItem value="FEMALE">Female</SelectItem>
                            </SelectContent>
                        </Select>

                        <Label>Current Institute</Label>
                        <Input id="currentInstitute" type="text" name="currentInstitute" placeholder="Enter current institute" required />

                        <Label>Current Class</Label>
                        <Select name="currentClass" required>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Class" />
                            </SelectTrigger>
                            <SelectContent>
                                {[
                                    "SIX", "SEVEN", "EIGHT", "NINE", "TEN", "ELEVEN", "TWELVE", "OTHER"
                                ].map((currentClass) => (
                                    <SelectItem key={currentClass} value={currentClass}>{currentClass}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Label>SSC Batch</Label>
                        <Input id="sscBatch" type="text" name="sscBatch" placeholder="Enter SSC batch year (e.g., 22)" required />

                        <Label>Guardian&apos;s Name</Label>
                        <Input id="guardianName" type="text" name="guardianName" placeholder="Enter guardian&apos;s name" required />

                        <Label>Guardian&apos;s Occupation</Label>
                        <Input id="guardianOccupation" type="text" name="guardianOccupation" placeholder="Enter guardian&apos;s occupation" required />

                        <Label>Guardian&apos;s Phone</Label>
                        <Input id="guardianPhone" type="text" name="guardianPhone" placeholder="Enter guardian&apos;s phone number" required />
                        <Button type="submit" className="w-full">Register Student</Button>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}

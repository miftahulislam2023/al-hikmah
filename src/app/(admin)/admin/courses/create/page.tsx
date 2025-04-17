import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Form from "next/form";
import { createCourse } from "@/actions/course";

export default function CreateCourse() {

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-md p-6 shadow-lg">
                <CardHeader>
                    <CardTitle className="text-center">Create Course</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form action={createCourse} className="space-y-4">
                        <Label>Semester</Label>
                        <Select name="semester">
                            <SelectTrigger>
                                <SelectValue placeholder="Select Semester" />
                            </SelectTrigger>
                            <SelectContent>
                                {[
                                    "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th",
                                    "11th", "12th", "13th", "14th", "15th", "16th", "17th", "18th", "19th", "20th",
                                ].map((semester) => (
                                    <SelectItem key={semester} value={semester}>{semester}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Label>Title</Label>
                        <Input id="title" type="text" name="title" placeholder="Enter course title" />

                        <Label>Course Fee</Label>
                        <Input id="fee" type="number" name="fee" placeholder="Enter course fee" />

                        <Label>Is Active</Label>
                        <Select name="isActive">
                            <SelectTrigger>
                                <SelectValue placeholder="Select Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="true">Active</SelectItem>
                                <SelectItem value="false">Inactive</SelectItem>
                            </SelectContent>
                        </Select>

                        <Button type="submit">Create</Button>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}

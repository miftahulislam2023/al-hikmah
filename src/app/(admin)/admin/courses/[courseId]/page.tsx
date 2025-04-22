import { updateCourse, getCourseById } from "@/actions/course";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import Form from "next/form";
import { notFound } from "next/navigation";

type PageProps = {
    params: {
        courseId: string
    }
}

export default async function Page({ params }: PageProps) {
    const { courseId } = params;

    const { data: course, error } = await getCourseById(courseId);
    if (!course || error) return notFound();

    return (
        <div className="min-h-screen bg-gray-100 px-6 py-20">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-5xl font-bold text-center mb-16 leading-tight text-gray-800">
                    Course Details
                </h1>

                <div className="bg-white shadow-lg rounded-xl p-8">
                    <Form action={updateCourse} className="space-y-6">
                        <Input type="hidden" name="courseId" value={course.id} />

                        <div className="space-y-2">
                            <Label>Semester</Label>
                            <Select name="semester" defaultValue={course.semester}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Semester" />
                                </SelectTrigger>
                                <SelectContent>
                                    {[
                                        "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th",
                                        "11th", "12th", "13th", "14th", "15th", "16th", "17th", "18th", "19th", "20th",
                                    ].map((semester) => (
                                        <SelectItem key={semester} value={semester}>
                                            {semester}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                type="text"
                                name="title"
                                defaultValue={course.title}
                                placeholder="Enter course title"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="fee">Course Fee</Label>
                            <Input
                                id="fee"
                                type="number"
                                name="fee"
                                defaultValue={course.fee}
                                placeholder="Enter course fee"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="isActive">Status</Label>
                            <Select name="isActive" defaultValue={String(course.isActive)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="true">Active</SelectItem>
                                    <SelectItem value="false">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <Button type="submit" className="w-full bg-gray-800 text-white text-lg rounded-lg py-3">
                            Update Course
                        </Button>
                    </Form>
                </div>
            </div>
        </div>
    );
}

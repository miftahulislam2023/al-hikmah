import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/auth";
import { addCourseToStudent } from "@/actions/student";
import { getBoughtCourses, getCourseById } from "@/actions/course";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

// Server action to handle enrollment
async function enrollInCourse(courseId: number, studentId: number) {
    "use server";

    try {
        // Add the course to student's enrolled courses
        await addCourseToStudent(studentId, courseId);

        // Revalidate relevant paths to refresh data
        revalidatePath('/profile/courses');
        revalidatePath(`/profile/courses/${courseId}`);

        // Redirect back to the same page to show updated enrollment status
        return { success: true, message: "Successfully enrolled in the course" };
    } catch (error) {
        console.error("Enrollment error:", error);
        return { success: false, message: "Failed to enroll in the course" };
    }
}

export default async function CourseDetails({ params }: { params: { courseId: string } }) {
    // Get the current authenticated student
    const session = await auth();
    const studentId = session?.user?.id ? parseInt(session.user.id) : null;

    if (!studentId) {
        // Redirect to login if not authenticated
        return redirect('/signin?callbackUrl=/profile/courses');
    }

    // Fetch the course details
    const { data: course, error } = await getCourseById(params.courseId);

    if (error || !course) {
        return notFound();
    }

    // Check if student is already enrolled in this course
    const enrolledCourses = await getBoughtCourses(studentId);
    const isEnrolled = enrolledCourses && !('error' in enrolledCourses) &&
        enrolledCourses.some(enrolledCourse => enrolledCourse.id === course.id);

    // Create the enrollment action with bound parameters
    const handleEnroll = enrollInCourse.bind(null, course.id, studentId);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-6 py-14">
            <div className="max-w-4xl mx-auto">
                <Card className="overflow-hidden border-0 shadow-xl">
                    {/* Course header with accent color */}
                    <div className="h-3 bg-blue-600"></div>

                    <CardHeader className="p-8 border-b border-gray-100">
                        <div className="flex items-center justify-between">
                            <div className="bg-blue-100 text-blue-700 rounded-full px-4 py-1 text-sm font-medium">
                                Semester {course.semester}
                            </div>
                            <div className={`rounded-full px-4 py-1 text-sm font-medium ${course.isActive
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-600"
                                }`}>
                                {course.isActive ? "Active" : "Inactive"}
                            </div>
                        </div>

                        <CardTitle className="text-3xl font-bold text-gray-800 mt-4">
                            {course.title}
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="p-8 space-y-8">
                        {/* Course details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-700">Course Information</h3>

                                <div className="space-y-3">
                                    <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                                        <span className="text-gray-600">Course Fee</span>
                                        <span className="font-bold text-lg">৳ {course.fee}</span>
                                    </div>

                                    <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                                        <span className="text-gray-600">Course Status</span>
                                        <span className={course.isActive ? "text-green-600" : "text-red-600"}>
                                            {course.isActive ? "Currently Active" : "Not Active"}
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                                        <span className="text-gray-600">Enrollment Status</span>
                                        <span className={isEnrolled ? "text-emerald-600 font-medium" : "text-blue-600 font-medium"}>
                                            {isEnrolled ? "Already Enrolled" : "Not Enrolled"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-700">Course Benefits</h3>

                                <ul className="space-y-2 text-gray-600">
                                    <li className="flex items-start">
                                        <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                        </svg>
                                        <span>Access to all learning materials</span>
                                    </li>
                                    <li className="flex items-start">
                                        <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                        </svg>
                                        <span>Regular assessments and feedback</span>
                                    </li>
                                    <li className="flex items-start">
                                        <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                        </svg>
                                        <span>Direct interaction with instructors</span>
                                    </li>
                                    <li className="flex items-start">
                                        <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                        </svg>
                                        <span>Certificate of completion</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Course description */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-700">About This Course</h3>
                            <p className="text-gray-600 leading-relaxed">
                                This comprehensive course provides students with the necessary knowledge and skills to excel in the subject.
                                Through a structured curriculum, you&apos;ll gain a deeper understanding of key concepts and practical applications.
                            </p>
                        </div>

                        {/* Enrollment action */}
                        <div className="pt-4">
                            {isEnrolled ? (
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
                                    <div className="bg-green-100 rounded-full p-2 mr-3">
                                        <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-green-800">You&apos;re already enrolled in this course</h4>
                                        <p className="text-sm text-green-700">Continue your learning journey from your course dashboard</p>
                                    </div>
                                </div>
                            ) : (
                                <form action={handleEnroll}>
                                    <Button className="w-full md:w-auto py-6 px-8 bg-blue-600 hover:bg-blue-700 text-lg" type="submit">
                                        Enroll in this Course
                                    </Button>
                                    <p className="mt-2 text-sm text-gray-500">
                                        *Payment information will be added later. For now, enrollment is free.
                                    </p>
                                </form>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
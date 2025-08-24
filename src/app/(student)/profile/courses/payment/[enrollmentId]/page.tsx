import { submitPayment } from "@/actions/enrollment";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/prisma";

interface PaymentPageProps {
    params: {
        enrollmentId: string;
    };
}

export default async function PaymentPage({ params }: PaymentPageProps) {
    const session = await auth();
    if (!session || session.user?.role !== "STUDENT") {
        redirect("/signin");
    }

    // Get the enrollment with course details
    const enrollment = await prisma.enrollment.findUnique({
        where: { id: params.enrollmentId },
        include: {
            course: true,
            student: {
                include: {
                    user: true
                }
            }
        }
    });

    if (!enrollment || enrollment.student.userId !== session.user.id) {
        return (
            <div className="container mx-auto p-6">
                <h1 className="text-2xl font-bold text-red-600 mb-4">Enrollment Not Found</h1>
                <p className="text-red-500 mb-4">The enrollment record was not found or you don&apos;t have access to it.</p>
                <Link href="/profile/courses/browse">
                    <Button variant="outline">← Back to Browse Courses</Button>
                </Link>
            </div>
        );
    }

    // If already paid or verified, redirect
    if (enrollment.paymentStatus === "VERIFIED") {
        redirect(`/profile/courses/${enrollment.courseId}`);
    }

    async function handlePaymentSubmission(formData: FormData) {
        "use server";
        const transactionId = formData.get("transactionId") as string;
        const paymentAmount = parseFloat(formData.get("paymentAmount") as string);
        const paymentMethod = formData.get("paymentMethod") as "BKASH" | "NAGAD" | "ROCKET";

        const result = await submitPayment(
            enrollment.id,
            transactionId,
            paymentAmount,
            paymentMethod
        );

        if (result.success) {
            redirect("/profile/courses?payment=submitted");
        }
    }

    return (
        <div className="container mx-auto p-6 max-w-3xl space-y-6">
            {/* Navigation */}
            <div className="flex items-center gap-3">
                <Link href="/profile/courses/browse">
                    <Button variant="outline" size="sm">
                        ← Back to Courses
                    </Button>
                </Link>
                <div className="text-sm text-gray-600">Payment</div>
            </div>

            {/* Course Information */}
            <Card>
                <CardHeader>
                    <CardTitle>Complete Your Enrollment</CardTitle>
                    <p className="text-gray-600">Submit payment details for course verification</p>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
                        <div className="text-4xl">📚</div>
                        <div className="flex-1">
                            <h3 className="font-semibold text-lg">{enrollment.course.title}</h3>
                            <p className="text-gray-600">{enrollment.course.description}</p>
                            <div className="flex gap-2 mt-2">
                                <Badge variant="outline">${enrollment.course.price}</Badge>
                                {enrollment.course.semester && (
                                    <Badge variant="outline">{enrollment.course.semester}</Badge>
                                )}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Payment Instructions */}
            <Card>
                <CardHeader>
                    <CardTitle>Payment Instructions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                        <h4 className="font-medium text-yellow-800 mb-2">📱 Mobile Money Payment</h4>
                        <div className="text-sm text-yellow-700 space-y-2">
                            <p><strong>Amount to Pay:</strong> ${enrollment.course.price}</p>
                            <p><strong>Payment Methods:</strong> bKash, Nagad, or Rocket</p>
                            <p><strong>Steps:</strong></p>
                            <ol className="list-decimal list-inside space-y-1 ml-4">
                                <li>Open your mobile money app (bKash/Nagad/Rocket)</li>
                                <li>Send ${enrollment.course.price} to our merchant number</li>
                                <li>Note down the transaction ID from your payment</li>
                                <li>Fill out the form below with your payment details</li>
                                <li>Our admin will verify and activate your course access</li>
                            </ol>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-pink-50 rounded-lg border border-pink-200">
                            <div className="text-2xl mb-2">📱</div>
                            <h5 className="font-medium text-pink-800">bKash</h5>
                            <p className="text-sm text-pink-600">01XXXXXXXXX</p>
                        </div>
                        <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
                            <div className="text-2xl mb-2">💳</div>
                            <h5 className="font-medium text-orange-800">Nagad</h5>
                            <p className="text-sm text-orange-600">01XXXXXXXXX</p>
                        </div>
                        <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                            <div className="text-2xl mb-2">🚀</div>
                            <h5 className="font-medium text-purple-800">Rocket</h5>
                            <p className="text-sm text-purple-600">01XXXXXXXXX</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Payment Form */}
            <Card>
                <CardHeader>
                    <CardTitle>Submit Payment Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <form action={handlePaymentSubmission} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="paymentMethod">Payment Method *</Label>
                                <Select name="paymentMethod" required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select payment method" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="BKASH">bKash</SelectItem>
                                        <SelectItem value="NAGAD">Nagad</SelectItem>
                                        <SelectItem value="ROCKET">Rocket</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="paymentAmount">Amount Paid *</Label>
                                <Input
                                    id="paymentAmount"
                                    name="paymentAmount"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    placeholder="0.00"
                                    defaultValue={enrollment.course.price}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="transactionId">Transaction ID *</Label>
                            <Input
                                id="transactionId"
                                name="transactionId"
                                placeholder="e.g., TXN123456789"
                                required
                            />
                            <p className="text-sm text-gray-600">
                                Find this in your mobile money app after completing the payment
                            </p>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-medium text-gray-800 mb-2">Payment Summary</h4>
                            <div className="space-y-1 text-sm">
                                <div className="flex justify-between">
                                    <span>Course:</span>
                                    <span>{enrollment.course.title}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Price:</span>
                                    <span>${enrollment.course.price}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Student:</span>
                                    <span>{enrollment.student.user.name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Enrollment Date:</span>
                                    <span>{new Date(enrollment.enrolledAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700">
                                Submit Payment Details
                            </Button>
                            <Link href="/profile/courses">
                                <Button type="button" variant="outline">
                                    Cancel
                                </Button>
                            </Link>
                        </div>

                        <div className="text-xs text-gray-500 text-center">
                            After submitting, our admin team will verify your payment within 24 hours.
                            You&apos;ll receive course access once payment is confirmed.
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

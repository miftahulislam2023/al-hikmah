import { getPendingPayments, verifyPayment } from "@/actions/enrollment";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";

export default async function PaymentPage() {
    const session = await auth();
    if (!session || session.user?.role !== "ADMIN") {
        redirect("/signin");
    }

    const { data: pendingPayments, error } = await getPendingPayments();

    async function handleVerifyPayment(formData: FormData) {
        "use server";
        const enrollmentId = formData.get("enrollmentId") as string;
        const action = formData.get("action") as "approve" | "reject";
        const adminId = session?.user?.adminId;

        if (!adminId) {
            throw new Error("Admin ID not found");
        }

        await verifyPayment(enrollmentId, adminId, action === "approve");
    }

    if (error) {
        return (
            <div className="container mx-auto p-6">
                <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-800">Payment Verification</h1>
                <Badge variant="secondary" className="text-lg px-3 py-1">
                    {pendingPayments?.length || 0} Pending
                </Badge>
            </div>

            {!pendingPayments || pendingPayments.length === 0 ? (
                <Card>
                    <CardContent className="text-center py-12">
                        <div className="text-gray-400 text-6xl mb-4">💳</div>
                        <h3 className="text-xl font-medium text-gray-700 mb-2">No Pending Payments</h3>
                        <p className="text-gray-500">All payments have been processed.</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {pendingPayments.map((enrollment) => (
                        <Card key={enrollment.id} className="border-l-4 border-l-orange-400">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg">
                                        {enrollment.student.user.name || enrollment.student.user.email}
                                    </CardTitle>
                                    <Badge variant="outline" className="text-orange-600 border-orange-600">
                                        Pending Payment
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="font-semibold text-gray-700">Course Details</h4>
                                        <p className="text-gray-600">{enrollment.course.title}</p>
                                        <p className="text-sm text-gray-500">
                                            Fee: ৳{enrollment.course.price}
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-700">Student Info</h4>
                                        <p className="text-gray-600">{enrollment.student.user.email}</p>
                                        <p className="text-sm text-gray-500">
                                            Phone: {enrollment.student.user.phone || "Not provided"}
                                        </p>
                                    </div>
                                </div>

                                {enrollment.paymentMethod && (
                                    <div>
                                        <h4 className="font-semibold text-gray-700">Payment Details</h4>
                                        <div className="bg-gray-50 p-3 rounded-lg space-y-1">
                                            <p><strong>Method:</strong> {enrollment.paymentMethod}</p>
                                            {enrollment.transactionId && (
                                                <p><strong>Transaction ID:</strong> {enrollment.transactionId}</p>
                                            )}
                                            <p><strong>Amount:</strong> ৳{enrollment.paymentAmount || enrollment.course.price}</p>
                                            <p><strong>Status:</strong> {enrollment.paymentStatus}</p>
                                        </div>
                                    </div>
                                )}

                                <div className="flex gap-3 pt-4">
                                    <form action={handleVerifyPayment} className="inline">
                                        <input type="hidden" name="enrollmentId" value={enrollment.id} />
                                        <input type="hidden" name="action" value="approve" />
                                        <Button
                                            type="submit"
                                            className="bg-green-600 hover:bg-green-700 text-white"
                                        >
                                            ✓ Approve Payment
                                        </Button>
                                    </form>
                                    <form action={handleVerifyPayment} className="inline">
                                        <input type="hidden" name="enrollmentId" value={enrollment.id} />
                                        <input type="hidden" name="action" value="reject" />
                                        <Button
                                            type="submit"
                                            variant="destructive"
                                        >
                                            ✗ Reject Payment
                                        </Button>
                                    </form>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { SessionProvider } from "next-auth/react";
import Link from "next/link";
import { signUpStudentAction } from "@/actions/student";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Submit button with loading state using useFormStatus
function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Creating account..." : "Create account"}
        </Button>
    );
}

function SignUpContent() {
    const router = useRouter();
    const [state, formAction] = useActionState(signUpStudentAction, {
        error: "",
        success: false,
        values: {
            name: "",
            email: "",
            phone: "",
            address: "",
            dob: "",
            gender: "",
            currentInstitute: "",
            currentClass: "",
            sscBatch: "",
            guardianName: "",
            guardianPhone: "",
            guardianOccupation: "",
        }
    });

    // Redirect to signin page after successful registration
    useEffect(() => {
        if (state.success) {
            // Delay redirect slightly to show success message
            const timeout = setTimeout(() => {
                router.push('/signin');
            }, 2000);

            return () => clearTimeout(timeout);
        }
    }, [state.success, router]);

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <Card className="w-full max-w-3xl shadow-lg">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">Student Registration</CardTitle>
                    <CardDescription className="text-center">
                        Create a student account to access your courses
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {state.success ? (
                        <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded mb-4">
                            Account created successfully! Redirecting to sign in page...
                        </div>
                    ) : (
                        <form action={formAction} className="space-y-4">
                            {state.error && (
                                <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                                    {state.error}
                                </div>
                            )}<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Basic Information */}                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input id="name" name="name" placeholder="Full Name" required defaultValue={state.values?.name || ""} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" name="email" placeholder="your.email@example.com" required defaultValue={state.values?.email || ""} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input id="password" type="password" name="password" placeholder="••••••••" required />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input id="phone" name="phone"  type="number" placeholder="Phone Number" required defaultValue={state.values?.phone || ""} />
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="address">Address</Label>
                                    <Input id="address" name="address" placeholder="Address" required defaultValue={state.values?.address || ""} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="dob">Date of Birth</Label>
                                    <Input id="dob" type="date" name="dob" required defaultValue={state.values?.dob || ""} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="gender">Gender</Label>
                                    <Select name="gender" defaultValue={state.values?.gender || ""} required>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select gender" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="MALE">Male</SelectItem>
                                            <SelectItem value="FEMALE">Female</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Educational Information */}
                                <div className="space-y-2">
                                    <Label htmlFor="currentInstitute">Current Institute</Label>
                                    <Input id="currentInstitute" name="currentInstitute" placeholder="Current Institute" required defaultValue={state.values?.currentInstitute || ""} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="currentClass">Current Class</Label>
                                    <Select name="currentClass" defaultValue={state.values?.currentClass || ""} required>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select class" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="SIX">Six</SelectItem>
                                            <SelectItem value="SEVEN">Seven</SelectItem>
                                            <SelectItem value="EIGHT">Eight</SelectItem>
                                            <SelectItem value="NINE">Nine</SelectItem>
                                            <SelectItem value="TEN">Ten</SelectItem>
                                            <SelectItem value="ELEVEN">Eleven</SelectItem>
                                            <SelectItem value="TWELVE">Twelve</SelectItem>
                                            <SelectItem value="OTHER">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>SSC Batch</Label>
                                    <Input id="sscBatch" type="number" name="sscBatch" placeholder="Enter SSC batch year (e.g., 22)" required defaultValue={state.values?.sscBatch || ""} />
                                </div>

                                {/* Guardian Information */}
                                <div className="space-y-2">
                                    <Label htmlFor="guardianName">Guardian Name</Label>
                                    <Input id="guardianName" name="guardianName" placeholder="Guardian Name" required defaultValue={state.values?.guardianName || ""} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="guardianPhone">Guardian Phone</Label>
                                    <Input id="guardianPhone" name="guardianPhone" type="number" placeholder="Guardian Phone" required defaultValue={state.values?.guardianPhone || ""} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="guardianOccupation">Guardian Occupation</Label>
                                    <Input id="guardianOccupation" name="guardianOccupation" placeholder="Guardian Occupation" required defaultValue={state.values?.guardianOccupation || ""} />
                                </div>
                            </div>                        <SubmitButton />
                        </form>
                    )}
                </CardContent>
                <CardFooter className="flex justify-center">
                    <p className="text-sm text-muted-foreground">
                        Already have an account? <Link href="/signin" className="text-primary hover:underline">Sign In</Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}

export default function SignupPage() {
    return (
        <SessionProvider>
            <SignUpContent />
        </SessionProvider>
    );
}
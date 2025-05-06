"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { useSession, SessionProvider } from "next-auth/react";
import { useEffect } from "react";
import Link from "next/link";
import { signupStudent as signupStudentAction } from "@/actions/auth";
// Use only for type annotations
import type { Class, Gender } from "@/lib/types";

// Server action for handling student registration
async function signupStudent(prevState: { error: string, success: boolean }, formData: FormData) {
    try {
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        if (!email || !password) {
            return { error: "Email and password are required", success: false };
        }

        if (password.length < 6) {
            return { error: "Password must be at least 6 characters", success: false };
        }

        // Use the server action to register the student
        const result = await signupStudentAction(formData);

        if (result && result.error) {
            return { error: result.error, success: false };
        }

        // If we get here, assume success
        return { success: true, error: "" };
    } catch (error) {
        console.error("Registration error:", error);
        return { error: "An unexpected error occurred", success: false };
    }
}

// Submit button with loading state
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
    const { data: session, status } = useSession();
    const [state, formAction] = useActionState(signupStudent, {
        error: "",
        success: false,
    });

    // Redirect if already signed in
    useEffect(() => {
        if (status === "authenticated" && session) {
            // Redirect based on role
            if (session.user.role === "ADMIN") {
                router.push("/admin");
            } else {
                router.push("/profile");
            }
        }
    }, [status, session, router]);

    // Redirect after successful registration
    useEffect(() => {
        if (state.success) {
            router.push("/signin");
        }
    }, [state.success, router]);

    // Show loading state while checking authentication status
    if (status === "loading") {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p>Loading...</p>
            </div>
        );
    }

    // Calculate current year for SSC batch dropdown
    const currentYear = new Date().getFullYear();
    const batchYears = Array.from({ length: 10 }, (_, i) => currentYear + i - 5);

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
                    <form action={formAction} className="space-y-4">
                        {state.error && (
                            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                                {state.error}
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Basic Information */}
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input id="name" name="name" placeholder="Full Name" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" name="email" placeholder="your.email@example.com" required />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" type="password" name="password" placeholder="••••••••" required />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input id="phone" name="phone" placeholder="Phone Number" />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="address">Address</Label>
                                <Input id="address" name="address" placeholder="Address" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="dob">Date of Birth</Label>
                                <Input id="dob" type="date" name="dob" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="gender">Gender</Label>
                                <Select name="gender">
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
                                <Input id="currentInstitute" name="currentInstitute" placeholder="Current Institute" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="currentClass">Current Class</Label>
                                <Select name="currentClass">
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
                                <Input id="sscBatch" type="text" name="sscBatch" placeholder="Enter SSC batch year (e.g., 22)" required />
                            </div>

                            {/* Guardian Information */}
                            <div className="space-y-2">
                                <Label htmlFor="guardianName">Guardian Name</Label>
                                <Input id="guardianName" name="guardianName" placeholder="Guardian Name" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="guardianPhone">Guardian Phone</Label>
                                <Input id="guardianPhone" name="guardianPhone" placeholder="Guardian Phone" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="guardianOccupation">Guardian Occupation</Label>
                                <Input id="guardianOccupation" name="guardianOccupation" placeholder="Guardian Occupation" />
                            </div>
                        </div>

                        <SubmitButton />
                    </form>
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
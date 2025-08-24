"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SessionProvider } from "next-auth/react";
import Link from "next/link";
import { signUpStudent } from "@/actions/auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface FormState {
    error: string;
    success: boolean;
    pending: boolean;
}

// Submit button with loading state using useFormStatus

function SignUpContent() {
    const router = useRouter();
    const [state, setState] = useState<FormState>({
        error: "",
        success: false,
        pending: false
    });

    // Redirect to signin page after successful registration
    useEffect(() => {
        if (state.success) {
            const timeout = setTimeout(() => {
                router.push('/signin');
            }, 2000);
            return () => clearTimeout(timeout);
        }
    }, [state.success, router]);

    const handleSubmit = async (formData: FormData) => {
        setState({ error: "", success: false, pending: true });

        try {
            const result = await signUpStudent(formData);

            if (result.error) {
                setState({ error: result.error, success: false, pending: false });
            } else {
                setState({ error: "", success: true, pending: false });
            }
        } catch {
            setState({ error: "An unexpected error occurred", success: false, pending: false });
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-white to-[#fd2d61]/10 p-4">
            <Card className="w-full max-w-3xl shadow-lg border-[#fd2d61]/20">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center text-[#fd2d61]">Student Registration</CardTitle>
                    <CardDescription className="text-center text-[#b02aff]">
                        Create a student account to access your courses
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {state.success ? (
                        <div className="p-3 bg-[#fd2d61]/10 border border-[#fd2d61] text-[#fd2d61] rounded mb-4">
                            Account created successfully! Redirecting to sign in page...
                        </div>
                    ) : (
                        <form action={handleSubmit} className="space-y-4">
                            {state.error && (
                                <div className="p-3 bg-[#fd2d61]/10 border border-[#fd2d61] text-[#fd2d61] rounded">
                                    {state.error}
                                </div>
                            )}<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Basic Information */}                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input id="name" name="name" placeholder="Full Name" required />
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
                                    <Input id="phone" name="phone" type="number" placeholder="Phone Number" required />
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="address">Address</Label>
                                    <Input id="address" name="address" placeholder="Address" required />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="dob">Date of Birth</Label>
                                    <Input id="dob" type="date" name="dob" required />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="gender">Gender</Label>
                                    <Select name="gender" required>
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
                                    <Input id="currentInstitute" name="currentInstitute" placeholder="Current Institute" required />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="currentClass">Current Class</Label>
                                    <Select name="currentClass" required>
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
                                    <Input id="sscBatch" type="number" name="sscBatch" placeholder="Enter SSC batch year (e.g., 22)" required />
                                </div>

                                {/* Guardian Information */}
                                <div className="space-y-2">
                                    <Label htmlFor="guardianName">Guardian Name</Label>
                                    <Input id="guardianName" name="guardianName" placeholder="Guardian Name" required />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="guardianPhone">Guardian Phone</Label>
                                    <Input id="guardianPhone" name="guardianPhone" type="number" placeholder="Guardian Phone" required />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="guardianOccupation">Guardian Occupation</Label>
                                    <Input id="guardianOccupation" name="guardianOccupation" placeholder="Guardian Occupation" required />
                                </div>
                            </div>                        <Button type="submit" className="w-full" disabled={state.pending}>
                                {state.pending ? "Creating account..." : "Create account"}
                            </Button>
                        </form>
                    )}
                </CardContent>
                <CardFooter className="flex justify-center">
                    <p className="text-sm text-muted-foreground">
                        Already have an account? <Link href="/signin" className="text-[#fd2d61] hover:text-[#b02aff] hover:underline">Sign In</Link>
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
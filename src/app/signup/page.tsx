"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { useSession, SessionProvider } from "next-auth/react";
import { useEffect } from "react";
import Link from "next/link";

// Server action for handling student registration
async function signupStudent(prevState: { error: string, success: boolean }, formData: FormData) {
    try {
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        // Make API call to register the student
        const response = await fetch("/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            return { error: data.message || "Registration failed", success: false };
        }

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

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">Sign Up</CardTitle>
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
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" name="email" placeholder="your.email@example.com" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" name="password" placeholder="••••••••" required />
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
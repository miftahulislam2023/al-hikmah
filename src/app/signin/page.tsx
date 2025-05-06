"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { signIn, useSession, SessionProvider } from "next-auth/react";
import { useEffect } from "react";

// Server action for handling authentication
async function authenticate(prevState: { error: string, success: boolean }, formData: FormData) {
    try {
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const role = formData.get("role") as string;

        const result = await signIn("credentials", {
            email,
            password,
            role,
            redirect: false,
        });

        if (result?.error) {
            return { error: "Invalid email or password", success: false };
        }

        return { success: true, error: "" };
    } catch (error) {
        console.error("Authentication error:", error);
        return { error: "An unexpected error occurred", success: false };
    }
}

// Submit button with loading state
function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Signing in..." : "Sign In"}
        </Button>
    );
}

function SignInContent() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [state, formAction] = useActionState(authenticate, { error: "", success: false });

    // Redirect if already signed in
    useEffect(() => {
        if (status === "authenticated" && session) {
            // Redirect based on role
            if (session.user.role === "ADMIN") {
                router.push("/admin");
            } else if (session.user.role === "TEACHER") {
                router.push("/teacher");
            } else {
                router.push("/profile");
            }
        }
    }, [status, session, router]);

    // Use effect to redirect after successful authentication
    useEffect(() => {
        if (state.success && session) {
            // Check user role and redirect accordingly
            if (session.user.role === "ADMIN") {
                router.push("/admin");
            } else if (session.user.role === "TEACHER") {
                router.push("/teacher");
            } else {
                router.push("/profile");
            }
            router.refresh();
        }
    }, [state.success, router, session]);

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
                    <CardTitle className="text-2xl font-bold text-center">Sign In</CardTitle>
                    <CardDescription className="text-center">
                        Enter your credentials to access your account
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

                        <div className="space-y-2">
                            <Label htmlFor="role">Sign in as</Label>
                            <select
                                id="role"
                                name="role"
                                className="w-full border-input flex h-9 rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                defaultValue="USER"
                            >
                                <option value="USER">Student</option>
                                <option value="TEACHER">Teacher</option>
                            </select>
                        </div>

                        <SubmitButton />
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <p className="text-sm text-muted-foreground">
                        Don&apos;t have an account? <a href="/signup" className="text-primary hover:underline">Sign Up</a>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}

export default function SignInPage() {
    return (
        <SessionProvider>
            <SignInContent />
        </SessionProvider>
    );
}
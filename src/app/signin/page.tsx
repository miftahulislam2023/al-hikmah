"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
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

export default function SignInPage() {
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

    // Handle Google sign-in
    const handleGoogleSignIn = async () => {
        try {
            await signIn("google", { callbackUrl: "/" });
        } catch (error) {
            console.error("Google sign-in error:", error);
        }
    };

    // Show loading state while checking authentication status
    if (status === "loading") {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-white to-[#fd2d61]/10 p-4">
            <Card className="w-full max-w-md shadow-lg border-[#fd2d61]/20">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center text-[#fd2d61]">Sign In</CardTitle>
                    <CardDescription className="text-center text-[#b02aff]">
                        Enter your credentials to access your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {/* Google Sign-in Button */}
                    <Button
                        onClick={handleGoogleSignIn}
                        variant="outline"
                        className="w-full mb-4 border-[#fd2d61]/20 hover:bg-[#fd2d61]/5"
                    >
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Continue with Google
                    </Button>

                    <div className="relative mb-4">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-[#fd2d61]/20" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-2 text-muted-foreground">Or continue with</span>
                        </div>
                    </div>

                    <form action={formAction} className="space-y-4">
                        {state.error && (
                            <div className="p-3 bg-[#fd2d61]/10 border border-[#fd2d61] text-[#fd2d61] rounded">
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
                                defaultValue="STUDENT"
                            >
                                <option value="STUDENT">Student</option>
                                <option value="TEACHER">Teacher</option>
                                <option value="ADMIN">Admin</option>
                            </select>
                        </div>

                        <SubmitButton />
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <p className="text-sm text-muted-foreground">
                        Don&apos;t have an account? <a href="/signup" className="text-[#fd2d61] hover:text-[#b02aff] hover:underline">Sign Up</a>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
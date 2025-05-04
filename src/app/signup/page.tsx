import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import Form from "next/form";
import { signupStudent as signupStudentAction } from "@/actions/auth";

async function signupStudent(formData: FormData) {
    "use server";

    let redirectPath: string | null = null;

    try {
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        if (!email || !password) {
            redirectPath = "/signup?error=missing_fields";
            return;
        }

        if (password.length < 6) {
            redirectPath = "/signup?error=password_too_short";
            return;
        }

        // Use the server action to register the student
        await signupStudentAction(formData);

        // If successful, redirect to signin
        redirectPath = "/signin?success=account_created";
    } catch (error) {
        console.error("Registration error:", error);
        redirectPath = "/signup?error=unexpected";
    } finally {
        if (redirectPath) {
            redirect(redirectPath);
        }
    }
}

export default async function SignupPage({
    searchParams
}: {
    searchParams: { error?: string, success?: string }
}) {
    const session = await auth();

    // Redirect if already signed in
    if (session) {
        const user = session.user;
        if (user.role === "ADMIN") {
            redirect("/admin/");
        } else {
            redirect("/profile");
        }
    }

    const error = searchParams.error || null;
    let errorMessage = "";

    // Handle different error cases
    if (error === "missing_fields") {
        errorMessage = "Email and password are required";
    } else if (error === "password_too_short") {
        errorMessage = "Password must be at least 6 characters";
    } else if (error === "unexpected") {
        errorMessage = "An unexpected error occurred";
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
                    <Form action={signupStudent} className="space-y-4">
                        {errorMessage && (
                            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                                {errorMessage}
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
                        <Button type="submit" className="w-full">
                            Create account
                        </Button>
                    </Form>
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
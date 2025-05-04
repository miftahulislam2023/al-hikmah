import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { auth, signIn } from "@/auth";
import Form from "next/form";
import Link from "next/link";
import { redirect } from "next/navigation";

async function authenticate(formData: FormData) {
    "use server"; // This is a server action
    let redirectPath: string | null = null
    try {
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        // Check if the result indicates an error
        if (result?.error) {
            return redirect("/signin?error=invalid_credentials");
        }

        const session = await auth();
        const user = session?.user;

        if (!user) {
            return redirect("/signin?error=auth_failed");
        }

        if (user.role === "ADMIN") {
            redirectPath = "/admin/";
        } else {
            redirectPath = "/profile";
        }
    } catch (error) {
        redirectPath = "/signin?error=invalid_credentials";
    } finally {
        if (redirectPath) {
            redirect(redirectPath);
        }
    }
}

export default async function SignInPage({
    searchParams
}: {
    searchParams: { error?: string }
}) {
    const session = await auth()
    if (session) {
        const user = session.user;
        if (user.role === "ADMIN") {
            redirect("/admin/");
        } else {
            redirect("/profile");
        }
    }

    const error = searchParams.error || null;

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
                    <Form action={authenticate} className="space-y-4">
                        {(error === "invalid_credentials") && (
                            <div className="text-red-500 text-sm text-center">
                                Invalid email or password
                            </div>
                        )}
                        {(error === "auth_failed") && (
                            <div className="text-red-500 text-sm text-center">
                                Authentication failed. Please try again.
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
                            <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded">Sign In
                            </Button>
                        </div>
                    </Form>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <p className="text-sm text-muted-foreground">
                        Don&apos;t have an account? <Link href="/signup" className="text-primary hover:underline">Sign Up</Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
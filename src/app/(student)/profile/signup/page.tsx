import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Form from "next/form";
import { signupStudent } from "@/actions/auth";

export default function () {
    return (
        <div className="flex justify-center items-center min-h-screen p-4">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">Sign Up</CardTitle>
                    <CardDescription className="text-center">
                        Create a student account to access your courses
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form action={signupStudent} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" name="email" placeholder="your.email@example.com" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" name="password" placeholder="••••••••" required />
                        </div>
                        <Button type="submit" className="w-full mt-4">Create account</Button>
                    </Form>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <p className="text-sm text-muted-foreground">
                        Already have an account? <a href="/api/auth/signin" className="text-primary hover:underline">Login</a>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
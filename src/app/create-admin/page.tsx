"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createAdmin } from "@/actions/auth";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateAdminPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState("");
    const router = useRouter();

    async function handleSubmit(formData: FormData) {
        setIsLoading(true);
        setMessage("");

        try {
            const result = await createAdmin(formData);

            if (result.error) {
                setMessage(result.error);
            } else {
                setMessage("Admin account created successfully! You can now login.");
                setTimeout(() => {
                    router.push("/signin");
                }, 2000);
            }
        } catch (error) {
            console.error("Admin creation error:", error);
            setMessage("An error occurred while creating the admin account.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-center text-red-600">
                        🔐 Create Admin Account
                    </CardTitle>
                    <p className="text-sm text-gray-600 text-center">
                        This page should only be used to create the first admin account.
                        <br />
                        <strong>Delete this page after use for security!</strong>
                    </p>
                </CardHeader>
                <CardContent>
                    <form action={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                name="name"
                                placeholder="Admin Name"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="admin@example.com"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone (Optional)</Label>
                            <Input
                                id="phone"
                                name="phone"
                                type="tel"
                                placeholder="+8801XXXXXXXXX"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="Strong password"
                                required
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-red-600 hover:bg-red-700"
                            disabled={isLoading}
                        >
                            {isLoading ? "Creating..." : "Create Admin Account"}
                        </Button>

                        {message && (
                            <div className={`text-sm text-center p-2 rounded ${message.includes("successfully")
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                                }`}>
                                {message}
                            </div>
                        )}
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

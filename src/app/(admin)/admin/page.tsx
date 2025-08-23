import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default async function AdminHome() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-white to-[#fd2d61]/10 p-8">
            <Card className="w-full max-w-lg shadow-lg border-[#fd2d61]/20">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold text-[#fd2d61]">Welcome to Neural Gem Academy</CardTitle>
                    <CardDescription className="text-xl text-[#b02aff] mt-2">Admin Control Panel</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-center text-lg text-[#fd2d61]/80">
                        Manage students, courses, and payments efficiently using the navigation menu.
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
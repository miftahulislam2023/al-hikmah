import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default async function AdminHome() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-8">
            <Card className="w-full max-w-lg shadow-lg">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold text-gray-800">Welcome to Neural Gem Academy</CardTitle>
                    <CardDescription className="text-xl text-gray-600 mt-2">Admin Control Panel</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-center text-lg text-gray-700">
                        Manage students, courses, and payments efficiently using the navigation menu.
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
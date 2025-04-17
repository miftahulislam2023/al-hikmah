import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SearchForm from "./SearchForm";

export default function SearchStudentPage() {
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
            <Card className="w-full max-w-3xl p-6 shadow-lg">
                <CardHeader>
                    <CardTitle className="text-center text-xl">Search Student</CardTitle>
                </CardHeader>
                <CardContent>
                    <SearchForm />
                </CardContent>
            </Card>
        </div>
    );
}

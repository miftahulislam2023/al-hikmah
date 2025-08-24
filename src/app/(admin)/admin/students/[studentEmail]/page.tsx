export default async function Page({ params }: { params: { studentEmail: string } }) {
    const { studentEmail } = await params;

    // Temporary disabled - need to implement with new schema
    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Student Details</h1>
            <p>Student email: {decodeURIComponent(studentEmail)}</p>
            <p className="text-gray-600 mt-4">This page needs to be reimplemented with the new user schema.</p>
        </div>
    );
}

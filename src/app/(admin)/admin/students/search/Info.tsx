export default function Info({ label, value }: { label: string; value: string | number | null | undefined }) {
    return (
        <div className="flex flex-col">
            <span className="font-medium text-gray-600">{label}</span>
            <span className="text-gray-900">{value ?? "N/A"}</span>
        </div>
    );
}
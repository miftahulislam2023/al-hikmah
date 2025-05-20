import { Loader } from 'lucide-react';

export default function Loading() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[200px] animate-pulse">
            <Loader className="w-12 h-12 text-primary animate-spin mb-4" />
            <span className="text-lg text-muted-foreground font-medium">Loading...</span>
        </div>
    );
}
"use client";

import { Button } from "@/components/ui/button";
import { deleteTeacher } from "@/actions/user";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface DeleteTeacherButtonProps {
    teacherId: string;
    teacherName: string;
}

export default function DeleteTeacherButton({ teacherId, teacherName }: DeleteTeacherButtonProps) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);

    async function handleDelete() {
        const confirmed = confirm(`Are you sure you want to delete ${teacherName}? This action cannot be undone.`);

        if (!confirmed) return;

        setIsDeleting(true);

        try {
            const result = await deleteTeacher(teacherId);

            if (result.error) {
                alert(`Failed to delete teacher: ${result.error}`);
            } else {
                // The page will automatically revalidate due to the server action
                router.refresh();
            }
        } catch (error) {
            alert("Failed to delete teacher. Please try again.");
            console.error("Error deleting teacher:", error);
        } finally {
            setIsDeleting(false);
        }
    }

    return (
        <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting}
        >
            {isDeleting ? "Deleting..." : "Delete"}
        </Button>
    );
}

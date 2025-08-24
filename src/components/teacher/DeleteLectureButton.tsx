"use client";

import { Button } from "@/components/ui/button";
import { deleteLecture } from "@/actions/lecture";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface DeleteLectureButtonProps {
    lectureId: string;
    lectureTitle: string;
}

export default function DeleteLectureButton({ lectureId, lectureTitle }: DeleteLectureButtonProps) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);

    async function handleDelete() {
        const confirmed = confirm(
            `Are you sure you want to delete "${lectureTitle}"? This action cannot be undone.`
        );

        if (!confirmed) return;

        setIsDeleting(true);

        try {
            const result = await deleteLecture(lectureId);

            if (result?.error) {
                alert(`Failed to delete lecture: ${result.error}`);
            } else {
                router.refresh();
            }
        } catch (error) {
            alert("Failed to delete lecture. Please try again.");
            console.error("Error deleting lecture:", error);
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

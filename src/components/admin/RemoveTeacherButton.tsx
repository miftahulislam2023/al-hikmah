"use client";

import { Button } from "@/components/ui/button";
import { removeTeacherFromCourse } from "@/actions/course";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface RemoveTeacherButtonProps {
    courseId: string;
    teacherId: string;
    teacherName: string;
    courseName: string;
}

export default function RemoveTeacherButton({
    courseId,
    teacherId,
    teacherName,
    courseName
}: RemoveTeacherButtonProps) {
    const router = useRouter();
    const [isRemoving, setIsRemoving] = useState(false);

    async function handleRemove() {
        const confirmed = confirm(
            `Are you sure you want to remove ${teacherName} from "${courseName}"?`
        );

        if (!confirmed) return;

        setIsRemoving(true);

        try {
            const formData = new FormData();
            formData.append("courseId", courseId);
            formData.append("teacherId", teacherId);

            const result = await removeTeacherFromCourse(formData);

            if (result?.error) {
                alert(`Failed to remove teacher: ${result.error}`);
            } else {
                router.refresh();
            }
        } catch (error) {
            alert("Failed to remove teacher. Please try again.");
            console.error("Error removing teacher:", error);
        } finally {
            setIsRemoving(false);
        }
    }

    return (
        <Button
            variant="destructive"
            size="sm"
            onClick={handleRemove}
            disabled={isRemoving}
        >
            {isRemoving ? "Removing..." : "Remove"}
        </Button>
    );
}

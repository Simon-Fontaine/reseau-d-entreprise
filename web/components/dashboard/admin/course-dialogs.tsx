"use client";

import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { type ActionState, deleteCourse } from "@/actions/admin";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Course {
  id: string;
  title: string;
  tutor?: {
    fullName: string;
  } | null;
}

interface DeleteCourseDialogProps {
  course: Course;
  children: React.ReactNode;
}

export function DeleteCourseDialog({
  course,
  children,
}: DeleteCourseDialogProps) {
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState<
    ActionState | null,
    FormData
  >(deleteCourse, null);

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message);
      setOpen(false);
    } else if (state?.success === false && state.message) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete course</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "{course.title}"
            {course.tutor ? ` by ${course.tutor.fullName}` : ""}? This action
            cannot be undone and will delete all chapters, quizzes, and
            enrollment data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <form action={formAction}>
            <input type="hidden" name="courseId" value={course.id} />
            <AlertDialogAction
              type="submit"
              variant="destructive"
              disabled={isPending}
            >
              {isPending ? "Deleting..." : "Delete course"}
            </AlertDialogAction>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

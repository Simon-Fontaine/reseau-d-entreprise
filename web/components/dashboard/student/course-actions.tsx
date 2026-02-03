"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import type { ActionState } from "@/actions/student-courses";
import {
  enrollInCourse,
  markChapterComplete,
  submitChapterQuiz,
} from "@/actions/student-courses";
import { Button } from "@/components/ui/button";

function useFeedback(state: ActionState | null) {
  useEffect(() => {
    if (state?.success) {
      toast.success(state.message);
    } else if (state?.success === false) {
      toast.error(state.message);
    }
  }, [state]);
}

export function EnrollButton({
  courseId,
  className,
  buttonClassName,
}: {
  courseId: string;
  className?: string;
  buttonClassName?: string;
}) {
  const [state, formAction, isPending] = useActionState(enrollInCourse, null);
  useFeedback(state);

  return (
    <form action={formAction} className={className}>
      <input type="hidden" name="courseId" value={courseId} />
      <Button type="submit" disabled={isPending} className={buttonClassName}>
        Enroll now
      </Button>
    </form>
  );
}

export function ChapterQuizForm({
  chapterId,
  questions,
}: {
  chapterId: string;
  questions: Array<{
    id: string;
    questionText: string;
    points: number | null;
    options: Array<{ id: string; optionText: string }>;
  }>;
}) {
  const [state, formAction, isPending] = useActionState(
    submitChapterQuiz,
    null,
  );
  useFeedback(state);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="chapterId" value={chapterId} />
      {questions.map((question) => (
        <div key={question.id} className="space-y-2">
          <div className="text-sm font-medium">
            {question.questionText}
            <span className="text-xs text-muted-foreground">
              {" "}
              ({question.points ?? 1} pts)
            </span>
          </div>
          <div className="space-y-2">
            {question.options.map((option) => (
              <label
                key={option.id}
                className="flex items-center gap-2 text-sm"
              >
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={option.id}
                  required
                />
                {option.optionText}
              </label>
            ))}
          </div>
        </div>
      ))}
      <Button type="submit" disabled={isPending}>
        Submit quiz
      </Button>
    </form>
  );
}

export function ChapterCompleteButton({ chapterId }: { chapterId: string }) {
  const [state, formAction, isPending] = useActionState(
    markChapterComplete,
    null,
  );
  useFeedback(state);

  return (
    <form action={formAction}>
      <input type="hidden" name="chapterId" value={chapterId} />
      <Button type="submit" variant="secondary" disabled={isPending}>
        Mark as done
      </Button>
    </form>
  );
}

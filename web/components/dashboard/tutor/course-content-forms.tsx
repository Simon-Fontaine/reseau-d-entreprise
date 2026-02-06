"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import type { ActionState } from "@/actions/tutor-courses";
import {
  createChapter,
  createQuizOption,
  createQuizQuestion,
  deleteChapter,
  deleteQuizOption,
  deleteQuizQuestion,
  deleteTutorCourse,
  updateChapter,
  updateQuizOption,
  updateQuizQuestion,
} from "@/actions/tutor-courses";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

function useFeedback(state: ActionState | null) {
  useEffect(() => {
    if (state?.success) {
      toast.success(state.message);
    } else if (state?.success === false) {
      toast.error(state.message);
    }
  }, [state]);
}

export function ChapterCreateForm({
  courseId,
  defaultOrderIndex,
}: {
  courseId: string;
  defaultOrderIndex: number;
}) {
  const [state, formAction, isPending] = useActionState(createChapter, null);
  useFeedback(state);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="courseId" value={courseId} />
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="new-chapter-title">Title</Label>
          <Input id="new-chapter-title" name="title" required />
          {state?.errors?.title && (
            <p className="text-[0.8rem] font-medium text-destructive">
              {state.errors.title.join(", ")}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="new-chapter-order">Order</Label>
          <Input
            id="new-chapter-order"
            name="orderIndex"
            type="number"
            min={1}
            defaultValue={defaultOrderIndex}
          />
          {state?.errors?.orderIndex && (
            <p className="text-[0.8rem] font-medium text-destructive">
              {state.errors.orderIndex.join(", ")}
            </p>
          )}
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="new-chapter-content">Content</Label>
          <Textarea id="new-chapter-content" name="contentMarkdown" rows={5} />
          {state?.errors?.contentMarkdown && (
            <p className="text-[0.8rem] font-medium text-destructive">
              {state.errors.contentMarkdown.join(", ")}
            </p>
          )}
        </div>
      </div>
      <Button type="submit" disabled={isPending}>
        Add chapter
      </Button>
    </form>
  );
}

export function CourseDeleteForm({ courseId }: { courseId: string }) {
  const [state, formAction, isPending] = useActionState(
    deleteTutorCourse,
    null,
  );
  useFeedback(state);

  return (
    <form action={formAction}>
      <input type="hidden" name="courseId" value={courseId} />
      <Button
        type="submit"
        variant="destructive"
        className="w-full"
        disabled={isPending}
      >
        Delete course
      </Button>
    </form>
  );
}

export function ChapterEditForm({
  chapterId,
  title,
  orderIndex,
  contentMarkdown,
}: {
  chapterId: string;
  title: string;
  orderIndex: number | null;
  contentMarkdown: string | null;
}) {
  const [state, formAction, isPending] = useActionState(updateChapter, null);
  useFeedback(state);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="chapterId" value={chapterId} />
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor={`chapter-title-${chapterId}`}>Title</Label>
          <Input
            id={`chapter-title-${chapterId}`}
            name="title"
            defaultValue={title}
            required
          />
          {state?.errors?.title && (
            <p className="text-[0.8rem] font-medium text-destructive">
              {state.errors.title.join(", ")}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor={`chapter-order-${chapterId}`}>Order</Label>
          <Input
            id={`chapter-order-${chapterId}`}
            name="orderIndex"
            type="number"
            min={1}
            defaultValue={orderIndex ?? 1}
          />
          {state?.errors?.orderIndex && (
            <p className="text-[0.8rem] font-medium text-destructive">
              {state.errors.orderIndex.join(", ")}
            </p>
          )}
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor={`chapter-content-${chapterId}`}>Content</Label>
          <Textarea
            id={`chapter-content-${chapterId}`}
            name="contentMarkdown"
            rows={5}
            defaultValue={contentMarkdown ?? ""}
          />
          {state?.errors?.contentMarkdown && (
            <p className="text-[0.8rem] font-medium text-destructive">
              {state.errors.contentMarkdown.join(", ")}
            </p>
          )}
        </div>
      </div>
      <Button type="submit" disabled={isPending}>
        Save chapter
      </Button>
    </form>
  );
}

export function ChapterDeleteForm({ chapterId }: { chapterId: string }) {
  const [state, formAction, isPending] = useActionState(deleteChapter, null);
  useFeedback(state);

  return (
    <form action={formAction}>
      <input type="hidden" name="chapterId" value={chapterId} />
      <Button type="submit" variant="destructive" disabled={isPending}>
        Delete chapter
      </Button>
    </form>
  );
}

export function QuizQuestionCreateForm({ chapterId }: { chapterId: string }) {
  const [state, formAction, isPending] = useActionState(
    createQuizQuestion,
    null,
  );
  useFeedback(state);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="chapterId" value={chapterId} />
      <div className="space-y-2">
        <Label htmlFor={`question-text-${chapterId}`}>Question</Label>
        <Input id={`question-text-${chapterId}`} name="questionText" required />
        {state?.errors?.questionText && (
          <p className="text-[0.8rem] font-medium text-destructive">
            {state.errors.questionText.join(", ")}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor={`question-points-${chapterId}`}>Points</Label>
        <Input
          id={`question-points-${chapterId}`}
          name="points"
          type="number"
          min={1}
          defaultValue={10}
        />
        {state?.errors?.points && (
          <p className="text-[0.8rem] font-medium text-destructive">
            {state.errors.points.join(", ")}
          </p>
        )}
      </div>
      <Button type="submit" disabled={isPending}>
        Add question
      </Button>
    </form>
  );
}

export function QuizQuestionEditForm({
  questionId,
  questionText,
  points,
}: {
  questionId: string;
  questionText: string;
  points: number | null;
}) {
  const [state, formAction, isPending] = useActionState(
    updateQuizQuestion,
    null,
  );
  useFeedback(state);

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="questionId" value={questionId} />
      <div className="space-y-2">
        <Label htmlFor={`question-text-${questionId}`}>Question</Label>
        <Input
          id={`question-text-${questionId}`}
          name="questionText"
          defaultValue={questionText}
          required
        />
        {state?.errors?.questionText && (
          <p className="text-[0.8rem] font-medium text-destructive">
            {state.errors.questionText.join(", ")}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor={`question-points-${questionId}`}>Points</Label>
        <Input
          id={`question-points-${questionId}`}
          name="points"
          type="number"
          min={1}
          defaultValue={points ?? 1}
        />
        {state?.errors?.points && (
          <p className="text-[0.8rem] font-medium text-destructive">
            {state.errors.points.join(", ")}
          </p>
        )}
      </div>
      <Button type="submit" disabled={isPending}>
        Update question
      </Button>
    </form>
  );
}

export function QuizQuestionDeleteForm({ questionId }: { questionId: string }) {
  const [state, formAction, isPending] = useActionState(
    deleteQuizQuestion,
    null,
  );
  useFeedback(state);

  return (
    <form action={formAction}>
      <input type="hidden" name="questionId" value={questionId} />
      <Button type="submit" variant="destructive" disabled={isPending}>
        Delete question
      </Button>
    </form>
  );
}

export function QuizOptionEditForm({
  optionId,
  optionText,
  isCorrect,
}: {
  optionId: string;
  optionText: string;
  isCorrect: boolean | null;
}) {
  const [state, formAction, isPending] = useActionState(updateQuizOption, null);
  useFeedback(state);

  return (
    <form action={formAction} className="space-y-2">
      <input type="hidden" name="optionId" value={optionId} />
      <div className="grid gap-2 md:grid-cols-[1fr_auto] md:items-center">
        <Input name="optionText" defaultValue={optionText} />
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <input
            type="checkbox"
            name="isCorrect"
            defaultChecked={isCorrect ?? false}
          />
          Correct
        </label>
      </div>
      {state?.errors?.optionText && (
        <p className="text-[0.8rem] font-medium text-destructive">
          {state.errors.optionText.join(", ")}
        </p>
      )}
      <Button type="submit" variant="outline" size="sm" disabled={isPending}>
        Save option
      </Button>
    </form>
  );
}

export function QuizOptionDeleteForm({ optionId }: { optionId: string }) {
  const [state, formAction, isPending] = useActionState(deleteQuizOption, null);
  useFeedback(state);

  return (
    <form action={formAction}>
      <input type="hidden" name="optionId" value={optionId} />
      <Button
        type="submit"
        variant="destructive"
        size="sm"
        disabled={isPending}
      >
        Delete
      </Button>
    </form>
  );
}

export function QuizOptionCreateForm({ questionId }: { questionId: string }) {
  const [state, formAction, isPending] = useActionState(createQuizOption, null);
  useFeedback(state);

  return (
    <form
      action={formAction}
      className="flex flex-col gap-3 rounded-md border p-3"
    >
      <input type="hidden" name="questionId" value={questionId} />
      <div className="space-y-2">
        <Label htmlFor={`option-text-${questionId}`}>New option</Label>
        <Input id={`option-text-${questionId}`} name="optionText" />
        {state?.errors?.optionText && (
          <p className="text-[0.8rem] font-medium text-destructive">
            {state.errors.optionText.join(", ")}
          </p>
        )}
      </div>
      <label className="flex items-center gap-2 text-sm text-muted-foreground">
        <input type="checkbox" name="isCorrect" />
        Correct answer
      </label>
      <Button type="submit" size="sm" disabled={isPending}>
        Add option
      </Button>
    </form>
  );
}

"use client";

import {
  Check,
  Circle,
  CircleCheck,
  HelpCircle,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import type { ActionState } from "@/actions/tutor-courses";
import {
  createQuizOption,
  createQuizQuestion,
  deleteQuizOption,
  deleteQuizQuestion,
  updateQuizOption,
  updateQuizQuestion,
} from "@/actions/tutor-courses";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// ============================================================================
// Types
// ============================================================================

export type QuizOption = {
  id: string;
  optionText: string;
  isCorrect: boolean | null;
};

export type QuizQuestion = {
  id: string;
  questionText: string;
  points: number | null;
  options: QuizOption[];
};

// ============================================================================
// Helpers
// ============================================================================

function useFeedback(state: ActionState | null) {
  useEffect(() => {
    if (state?.success) {
      toast.success(state.message);
    } else if (state?.success === false) {
      toast.error(state.message);
    }
  }, [state]);
}

// ============================================================================
// Create Question Dialog
// ============================================================================

export function CreateQuestionDialog({
  chapterId,
  children,
}: {
  chapterId: string;
  children?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(
    createQuizQuestion,
    null,
  );

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message);
      setOpen(false);
    } else if (state?.success === false) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children ?? (
          <Button variant="outline" size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add question
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add quiz question</DialogTitle>
          <DialogDescription>
            Create a new multiple-choice question. You&apos;ll add answer
            options after creating the question.
          </DialogDescription>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="chapterId" value={chapterId} />
          <div className="space-y-2">
            <Label htmlFor="new-question-text">Question</Label>
            <Input
              id="new-question-text"
              name="questionText"
              placeholder="e.g., What is the capital of France?"
              required
            />
            {state?.errors?.questionText && (
              <p className="text-[0.8rem] font-medium text-destructive">
                {state.errors.questionText.join(", ")}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-question-points">Points</Label>
            <Input
              id="new-question-points"
              name="points"
              type="number"
              min={1}
              max={100}
              defaultValue={10}
            />
            <p className="text-xs text-muted-foreground">
              Points awarded for a correct answer
            </p>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating..." : "Create question"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ============================================================================
// Edit Question Dialog
// ============================================================================

export function EditQuestionDialog({
  question,
  children,
}: {
  question: QuizQuestion;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(
    updateQuizQuestion,
    null,
  );

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message);
      setOpen(false);
    } else if (state?.success === false) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit question</DialogTitle>
          <DialogDescription>
            Update the question text and point value.
          </DialogDescription>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="questionId" value={question.id} />
          <div className="space-y-2">
            <Label htmlFor={`edit-question-${question.id}`}>Question</Label>
            <Input
              id={`edit-question-${question.id}`}
              name="questionText"
              defaultValue={question.questionText}
              required
            />
            {state?.errors?.questionText && (
              <p className="text-[0.8rem] font-medium text-destructive">
                {state.errors.questionText.join(", ")}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor={`edit-question-points-${question.id}`}>
              Points
            </Label>
            <Input
              id={`edit-question-points-${question.id}`}
              name="points"
              type="number"
              min={1}
              max={100}
              defaultValue={question.points ?? 10}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ============================================================================
// Delete Question Dialog
// ============================================================================

export function DeleteQuestionDialog({
  questionId,
  children,
}: {
  questionId: string;
  children: React.ReactNode;
}) {
  const [state, formAction, isPending] = useActionState(
    deleteQuizQuestion,
    null,
  );
  useFeedback(state);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete question?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete this question and all its answer
            options. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <form action={formAction}>
            <input type="hidden" name="questionId" value={questionId} />
            <AlertDialogAction
              type="submit"
              disabled={isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isPending ? "Deleting..." : "Delete question"}
            </AlertDialogAction>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// ============================================================================
// Option Inline Editor
// ============================================================================

function OptionEditor({
  option,
}: {
  option: QuizOption;
  onUpdate?: () => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [updateState, updateAction, isUpdating] = useActionState(
    updateQuizOption,
    null,
  );
  const [deleteState, deleteAction, isDeleting] = useActionState(
    deleteQuizOption,
    null,
  );

  useEffect(() => {
    if (updateState?.success) {
      toast.success(updateState.message);
      setIsEditing(false);
    } else if (updateState?.success === false) {
      toast.error(updateState.message);
    }
  }, [updateState]);

  useFeedback(deleteState);

  if (isEditing) {
    return (
      <form action={updateAction} className="flex items-start gap-2">
        <input type="hidden" name="optionId" value={option.id} />
        <div className="flex-1 space-y-2">
          <Input
            name="optionText"
            defaultValue={option.optionText}
            autoFocus
            required
          />
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              name="isCorrect"
              defaultChecked={option.isCorrect ?? false}
              className="h-4 w-4 rounded border-gray-300"
            />
            <span className="text-muted-foreground">
              Mark as correct answer
            </span>
          </label>
        </div>
        <Button type="submit" size="sm" disabled={isUpdating}>
          <Check className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setIsEditing(false)}
        >
          <X className="h-4 w-4" />
        </Button>
      </form>
    );
  }

  return (
    <div className="group flex items-center gap-2 rounded-md border bg-card p-3 transition-colors hover:bg-muted/50">
      {option.isCorrect ? (
        <CircleCheck className="h-5 w-5 shrink-0 text-green-600" />
      ) : (
        <Circle className="h-5 w-5 shrink-0 text-muted-foreground" />
      )}
      <span className="flex-1 text-sm">{option.optionText}</span>
      {option.isCorrect && (
        <Badge
          variant="secondary"
          className="text-xs bg-green-100 text-green-700"
        >
          Correct
        </Badge>
      )}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={() => setIsEditing(true)}
        >
          <Pencil className="h-3 w-3" />
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon-xs">
              <Trash2 className="h-3 w-3 text-destructive" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent size="sm">
            <AlertDialogHeader>
              <AlertDialogTitle>Delete option?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <form action={deleteAction}>
                <input type="hidden" name="optionId" value={option.id} />
                <AlertDialogAction
                  type="submit"
                  disabled={isDeleting}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </form>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}

// ============================================================================
// Add Option Form
// ============================================================================

function AddOptionForm({ questionId }: { questionId: string }) {
  const [isAdding, setIsAdding] = useState(false);
  const [state, formAction, isPending] = useActionState(createQuizOption, null);

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message);
      setIsAdding(false);
    } else if (state?.success === false) {
      toast.error(state.message);
    }
  }, [state]);

  if (!isAdding) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsAdding(true)}
        className="w-full justify-start text-muted-foreground hover:text-foreground border-dashed border"
      >
        <Plus className="mr-2 h-4 w-4" />
        Add answer option
      </Button>
    );
  }

  return (
    <form
      action={formAction}
      className="space-y-3 rounded-md border p-3 bg-muted/30"
    >
      <input type="hidden" name="questionId" value={questionId} />
      <div className="space-y-2">
        <Input
          name="optionText"
          placeholder="Enter answer option..."
          autoFocus
          required
        />
        {state?.errors?.optionText && (
          <p className="text-[0.8rem] font-medium text-destructive">
            {state.errors.optionText.join(", ")}
          </p>
        )}
      </div>
      <label className="flex items-center gap-2 text-sm cursor-pointer">
        <input
          type="checkbox"
          name="isCorrect"
          className="h-4 w-4 rounded border-gray-300"
        />
        <span className="text-muted-foreground">Mark as correct answer</span>
      </label>
      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={isPending}>
          {isPending ? "Adding..." : "Add option"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setIsAdding(false)}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}

// ============================================================================
// Question Card
// ============================================================================

export function QuestionCard({
  question,
  index,
}: {
  question: QuizQuestion;
  index: number;
}) {
  const hasCorrectAnswer = question.options.some((opt) => opt.isCorrect);
  const optionCount = question.options.length;

  return (
    <Card size="sm">
      <CardHeader className="flex flex-row items-start gap-3 pb-3">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted text-xs font-medium">
          Q{index + 1}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm leading-relaxed">
            {question.questionText}
          </div>
          <div className="flex items-center gap-2 mt-1.5">
            <Badge variant="outline" className="text-xs">
              {question.points ?? 10} pts
            </Badge>
            {optionCount === 0 ? (
              <Badge variant="destructive" className="text-xs">
                No options
              </Badge>
            ) : !hasCorrectAnswer ? (
              <Badge variant="destructive" className="text-xs">
                No correct answer
              </Badge>
            ) : (
              <Badge variant="secondary" className="text-xs">
                {optionCount} option{optionCount !== 1 ? "s" : ""}
              </Badge>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <EditQuestionDialog question={question}>
            <Button variant="ghost" size="icon-xs">
              <Pencil className="h-3.5 w-3.5" />
            </Button>
          </EditQuestionDialog>
          <DeleteQuestionDialog questionId={question.id}>
            <Button variant="ghost" size="icon-xs">
              <Trash2 className="h-3.5 w-3.5 text-destructive" />
            </Button>
          </DeleteQuestionDialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {question.options.map((option) => (
          <OptionEditor key={option.id} option={option} />
        ))}
        <AddOptionForm questionId={question.id} />
      </CardContent>
    </Card>
  );
}

// ============================================================================
// Quiz Builder (Main Component)
// ============================================================================

export function QuizBuilder({
  chapterId,
  questions,
}: {
  chapterId: string;
  questions: QuizQuestion[];
}) {
  const totalPoints = questions.reduce((sum, q) => sum + (q.points ?? 10), 0);
  const questionsWithoutCorrect = questions.filter(
    (q) => !q.options.some((o) => o.isCorrect),
  );
  const hasValidationIssues =
    questionsWithoutCorrect.length > 0 ||
    questions.some((q) => q.options.length === 0);

  return (
    <div className="space-y-4">
      {/* Quiz Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-muted-foreground" />
            Quiz questions
          </h4>
          {questions.length > 0 && (
            <p className="text-xs text-muted-foreground">
              {questions.length} question{questions.length !== 1 ? "s" : ""} •{" "}
              {totalPoints} total points
              {hasValidationIssues && (
                <span className="text-destructive ml-2">
                  (has validation issues)
                </span>
              )}
            </p>
          )}
        </div>
        <CreateQuestionDialog chapterId={chapterId} />
      </div>

      {/* Questions List */}
      {questions.length === 0 ? (
        <div className="rounded-lg border border-dashed p-6 text-center">
          <HelpCircle className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">
            No quiz questions yet. Add your first question to test student
            understanding.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {questions.map((question, idx) => (
            <QuestionCard key={question.id} question={question} index={idx} />
          ))}
        </div>
      )}
    </div>
  );
}

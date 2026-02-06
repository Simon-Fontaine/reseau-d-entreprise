"use client";

import {
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import type { ActionState } from "@/actions/tutor-courses";
import {
  createChapter,
  deleteChapter,
  updateChapter,
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
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// ============================================================================
// Types
// ============================================================================

export type ChapterQuestion = {
  id: string;
  questionText: string;
  points: number | null;
  options: Array<{
    id: string;
    optionText: string;
    isCorrect: boolean | null;
  }>;
};

export type Chapter = {
  id: string;
  title: string;
  orderIndex: number | null;
  contentMarkdown: string | null;
  questions: ChapterQuestion[];
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
// Create Chapter Dialog
// ============================================================================

export function CreateChapterDialog({
  courseId,
  defaultOrderIndex,
  children,
}: {
  courseId: string;
  defaultOrderIndex: number;
  children?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(createChapter, null);

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
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add chapter
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create new chapter</DialogTitle>
          <DialogDescription>
            Add a new chapter to your course. You can add content and quiz
            questions after creating it.
          </DialogDescription>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="courseId" value={courseId} />
          <div className="space-y-2">
            <Label htmlFor="create-chapter-title">Chapter title</Label>
            <Input
              id="create-chapter-title"
              name="title"
              placeholder="e.g., Introduction to Variables"
              required
            />
            {state?.errors?.title && (
              <p className="text-[0.8rem] font-medium text-destructive">
                {state.errors.title.join(", ")}
              </p>
            )}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="create-chapter-order">Order position</Label>
              <Input
                id="create-chapter-order"
                name="orderIndex"
                type="number"
                min={1}
                defaultValue={defaultOrderIndex}
              />
              <p className="text-xs text-muted-foreground">
                Determines the chapter sequence
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="create-chapter-content">
              Content (Markdown supported)
            </Label>
            <Textarea
              id="create-chapter-content"
              name="contentMarkdown"
              rows={8}
              placeholder="Write your chapter content here. You can use **bold**, *italic*, and other Markdown formatting..."
            />
            {state?.errors?.contentMarkdown && (
              <p className="text-[0.8rem] font-medium text-destructive">
                {state.errors.contentMarkdown.join(", ")}
              </p>
            )}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating..." : "Create chapter"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ============================================================================
// Edit Chapter Dialog
// ============================================================================

export function EditChapterDialog({
  chapter,
  children,
}: {
  chapter: Chapter;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(updateChapter, null);

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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit chapter</DialogTitle>
          <DialogDescription>
            Update the chapter details and content.
          </DialogDescription>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="chapterId" value={chapter.id} />
          <div className="space-y-2">
            <Label htmlFor={`edit-chapter-title-${chapter.id}`}>
              Chapter title
            </Label>
            <Input
              id={`edit-chapter-title-${chapter.id}`}
              name="title"
              defaultValue={chapter.title}
              required
            />
            {state?.errors?.title && (
              <p className="text-[0.8rem] font-medium text-destructive">
                {state.errors.title.join(", ")}
              </p>
            )}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor={`edit-chapter-order-${chapter.id}`}>
                Order position
              </Label>
              <Input
                id={`edit-chapter-order-${chapter.id}`}
                name="orderIndex"
                type="number"
                min={1}
                defaultValue={chapter.orderIndex ?? 1}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor={`edit-chapter-content-${chapter.id}`}>
              Content (Markdown supported)
            </Label>
            <Textarea
              id={`edit-chapter-content-${chapter.id}`}
              name="contentMarkdown"
              rows={10}
              defaultValue={chapter.contentMarkdown ?? ""}
            />
            {state?.errors?.contentMarkdown && (
              <p className="text-[0.8rem] font-medium text-destructive">
                {state.errors.contentMarkdown.join(", ")}
              </p>
            )}
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
// Delete Chapter Dialog
// ============================================================================

export function DeleteChapterDialog({
  chapterId,
  chapterTitle,
  children,
}: {
  chapterId: string;
  chapterTitle: string;
  children: React.ReactNode;
}) {
  const [state, formAction, isPending] = useActionState(deleteChapter, null);
  useFeedback(state);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete chapter?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete &ldquo;{chapterTitle}&rdquo; and all
            its quiz questions. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <form action={formAction}>
            <input type="hidden" name="chapterId" value={chapterId} />
            <AlertDialogAction
              type="submit"
              disabled={isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isPending ? "Deleting..." : "Delete chapter"}
            </AlertDialogAction>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// ============================================================================
// Chapter Card (Collapsible)
// ============================================================================

export function ChapterCard({
  chapter,
  index,
  quizBuilder,
}: {
  chapter: Chapter;
  index: number;
  quizBuilder: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const hasQuestions = chapter.questions.length > 0;
  const hasContent = !!chapter.contentMarkdown?.trim();

  return (
    <Card className="overflow-hidden">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="p-0">
          <div className="flex items-center gap-3 p-4">
            <CollapsibleTrigger asChild>
              <button
                type="button"
                className="flex flex-1 items-center gap-3 text-left hover:bg-muted/50 transition-colors rounded-md -m-2 p-2"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-medium">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{chapter.title}</div>
                  <div className="flex items-center gap-2 mt-1">
                    {hasContent ? (
                      <Badge variant="secondary" className="text-xs">
                        Has content
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs">
                        No content
                      </Badge>
                    )}
                    <Badge
                      variant={hasQuestions ? "secondary" : "outline"}
                      className="text-xs"
                    >
                      {chapter.questions.length} question
                      {chapter.questions.length !== 1 ? "s" : ""}
                    </Badge>
                  </div>
                </div>
                {isOpen ? (
                  <ChevronUp className="h-5 w-5 text-muted-foreground shrink-0" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-muted-foreground shrink-0" />
                )}
              </button>
            </CollapsibleTrigger>
            <div className="flex items-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon-sm">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Actions</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <EditChapterDialog chapter={chapter}>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit chapter
                    </DropdownMenuItem>
                  </EditChapterDialog>
                  <DropdownMenuSeparator />
                  <DeleteChapterDialog
                    chapterId={chapter.id}
                    chapterTitle={chapter.title}
                  >
                    <DropdownMenuItem
                      onSelect={(e) => e.preventDefault()}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete chapter
                    </DropdownMenuItem>
                  </DeleteChapterDialog>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CollapsibleContent>
          <CardContent className="border-t pt-4">{quizBuilder}</CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}

// ============================================================================
// Empty State
// ============================================================================

export function EmptyChaptersState({
  courseId,
  defaultOrderIndex,
}: {
  courseId: string;
  defaultOrderIndex: number;
}) {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-4 rounded-full bg-muted p-3">
          <Plus className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium mb-2">No chapters yet</h3>
        <p className="text-sm text-muted-foreground mb-4 max-w-md">
          Get started by adding your first chapter. Each chapter can contain
          lesson content and quiz questions for students.
        </p>
        <CreateChapterDialog
          courseId={courseId}
          defaultOrderIndex={defaultOrderIndex}
        />
      </CardContent>
    </Card>
  );
}

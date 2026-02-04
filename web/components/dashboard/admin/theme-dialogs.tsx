"use client";

import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  type ActionState,
  createTheme,
  deleteTheme,
  updateTheme,
} from "@/actions/admin";
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
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Theme {
  id: string;
  name: string;
  emoji: string | null;
}

interface CreateThemeDialogProps {
  children: React.ReactNode;
}

export function CreateThemeDialog({ children }: CreateThemeDialogProps) {
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState<
    ActionState | null,
    FormData
  >(createTheme, null);

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message);
      setOpen(false);
    } else if (state?.success === false && state.message) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create theme</DialogTitle>
          <DialogDescription>
            Add a new theme for categorizing courses.
          </DialogDescription>
        </DialogHeader>
        <form action={formAction}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="e.g. Business English"
                required
              />
              {state?.errors?.name && (
                <p className="text-sm text-destructive">{state.errors.name}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="emoji">Emoji (optional)</Label>
              <Input id="emoji" name="emoji" placeholder="e.g. 💼" />
              {state?.errors?.emoji && (
                <p className="text-sm text-destructive">{state.errors.emoji}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating..." : "Create theme"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

interface EditThemeDialogProps {
  theme: Theme;
  children: React.ReactNode;
}

export function EditThemeDialog({ theme, children }: EditThemeDialogProps) {
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState<
    ActionState | null,
    FormData
  >(updateTheme, null);

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message);
      setOpen(false);
    } else if (state?.success === false && state.message) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit theme</DialogTitle>
          <DialogDescription>Update the theme details.</DialogDescription>
        </DialogHeader>
        <form action={formAction}>
          <input type="hidden" name="themeId" value={theme.id} />
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                name="name"
                defaultValue={theme.name}
                required
              />
              {state?.errors?.name && (
                <p className="text-sm text-destructive">{state.errors.name}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-emoji">Emoji (optional)</Label>
              <Input
                id="edit-emoji"
                name="emoji"
                defaultValue={theme.emoji ?? ""}
              />
              {state?.errors?.emoji && (
                <p className="text-sm text-destructive">{state.errors.emoji}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

interface DeleteThemeDialogProps {
  theme: Theme;
  children: React.ReactNode;
}

export function DeleteThemeDialog({ theme, children }: DeleteThemeDialogProps) {
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState<
    ActionState | null,
    FormData
  >(deleteTheme, null);

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
          <AlertDialogTitle>Delete theme</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the theme "{theme.name}"? This
            action cannot be undone. Themes that are being used by courses
            cannot be deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <form action={formAction}>
            <input type="hidden" name="themeId" value={theme.id} />
            <AlertDialogAction
              type="submit"
              variant="destructive"
              disabled={isPending}
            >
              {isPending ? "Deleting..." : "Delete theme"}
            </AlertDialogAction>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

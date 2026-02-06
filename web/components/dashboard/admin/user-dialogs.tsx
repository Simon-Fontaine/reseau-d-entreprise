"use client";

import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { type ActionState, deleteUser, updateUser } from "@/actions/admin";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface User {
  id: string;
  fullName: string;
  email: string;
  role: "student" | "tutor" | "admin" | null;
}

interface EditUserDialogProps {
  user: User;
  disabled?: boolean;
  children: React.ReactNode;
}

export function EditUserDialog({
  user,
  disabled,
  children,
}: EditUserDialogProps) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState(user.email);
  const [selectedRole, setSelectedRole] = useState(user.role ?? "student");
  const [state, formAction, isPending] = useActionState<
    ActionState | null,
    FormData
  >(updateUser, null);

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setEmail(user.email);
      setSelectedRole(user.role ?? "student");
    }
  }, [open, user.email, user.role]);

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
      <DialogTrigger asChild disabled={disabled}>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit user</DialogTitle>
          <DialogDescription>
            Update details for {user.fullName}
          </DialogDescription>
        </DialogHeader>
        <form action={formAction}>
          <input type="hidden" name="userId" value={user.id} />
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {state?.errors?.email && (
                <p className="text-sm text-destructive">{state.errors.email}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select
                name="role"
                value={selectedRole}
                onValueChange={(value) =>
                  setSelectedRole(value as "student" | "tutor" | "admin")
                }
              >
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="tutor">Tutor</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
              {state?.errors?.role && (
                <p className="text-sm text-destructive">{state.errors.role}</p>
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

interface DeleteUserDialogProps {
  user: User;
  disabled?: boolean;
  children: React.ReactNode;
}

export function DeleteUserDialog({
  user,
  disabled,
  children,
}: DeleteUserDialogProps) {
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState<
    ActionState | null,
    FormData
  >(deleteUser, null);

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
      <AlertDialogTrigger asChild disabled={disabled}>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete user</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete {user.fullName} ({user.email})? This
            action cannot be undone and will delete all their associated data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <form action={formAction}>
            <input type="hidden" name="userId" value={user.id} />
            <AlertDialogAction
              type="submit"
              variant="destructive"
              disabled={isPending}
            >
              {isPending ? "Deleting..." : "Delete user"}
            </AlertDialogAction>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

const roleConfig = {
  student: {
    label: "Student",
    variant: "secondary" as const,
  },
  tutor: {
    label: "Tutor",
    variant: "default" as const,
  },
  admin: {
    label: "Admin",
    variant: "destructive" as const,
  },
};

export function UserRoleBadge({ role }: { role: User["role"] }) {
  const config = roleConfig[role ?? "student"];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}

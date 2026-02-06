"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { updatePassword } from "@/actions/account";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { updatePasswordSchema } from "@/validations/account";

export function SettingsPasswordForm() {
  const [state, formAction, isPending] = useActionState(updatePassword, null);

  const form = useForm<z.infer<typeof updatePasswordSchema>>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message);
      form.reset();
    } else if (state?.success === false) {
      toast.error(state.message);
    }
  }, [state, form]);

  function onSubmit(data: z.infer<typeof updatePasswordSchema>) {
    startTransition(() => {
      formAction(data);
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Password</CardTitle>
        <CardDescription>
          Change your password to keep your account secure.
        </CardDescription>
      </CardHeader>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="space-y-4 pb-6">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <PasswordInput
              id="currentPassword"
              {...form.register("currentPassword")}
            />
            {form.formState.errors.currentPassword && (
              <p className="text-[0.8rem] font-medium text-destructive">
                {form.formState.errors.currentPassword.message}
              </p>
            )}
            {state?.errors?.currentPassword && (
              <p className="text-[0.8rem] font-medium text-destructive">
                {state.errors.currentPassword.join(", ")}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <PasswordInput id="newPassword" {...form.register("newPassword")} />
            {form.formState.errors.newPassword && (
              <p className="text-[0.8rem] font-medium text-destructive">
                {form.formState.errors.newPassword.message}
              </p>
            )}
            {state?.errors?.newPassword && (
              <p className="text-[0.8rem] font-medium text-destructive">
                {state.errors.newPassword.join(", ")}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
            <PasswordInput
              id="confirmNewPassword"
              {...form.register("confirmNewPassword")}
            />
            {form.formState.errors.confirmNewPassword && (
              <p className="text-[0.8rem] font-medium text-destructive">
                {form.formState.errors.confirmNewPassword.message}
              </p>
            )}
            {state?.errors?.confirmNewPassword && (
              <p className="text-[0.8rem] font-medium text-destructive">
                {state.errors.confirmNewPassword.join(", ")}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button
            disabled={isPending || !form.formState.isDirty}
            className="w-full sm:w-auto"
          >
            {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
            Update Password
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

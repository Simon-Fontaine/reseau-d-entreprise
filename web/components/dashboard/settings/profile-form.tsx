"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { updateProfile } from "@/actions/account";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateProfileSchema } from "@/validations/account";

type ProfileFormProps = {
  defaultValues: {
    fullName: string;
    email: string;
  };
};

export function SettingsProfileForm({ defaultValues }: ProfileFormProps) {
  const [state, formAction, isPending] = useActionState(updateProfile, null);

  const form = useForm<z.infer<typeof updateProfileSchema>>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      fullName: defaultValues.fullName,
    },
  });

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message);
    } else if (state?.success === false) {
      toast.error(state.message);
    }
  }, [state]);

  function onSubmit(data: z.infer<typeof updateProfileSchema>) {
    startTransition(() => {
      formAction(data);
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>
          Manage your public profile information.
        </CardDescription>
      </CardHeader>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="space-y-4 pb-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={defaultValues.email}
              disabled
              className="bg-muted"
            />
            <p className="text-[0.8rem] text-muted-foreground">
              Email addresses are managed by your administrator.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="fullName">Display Name</Label>
            <Input
              id="fullName"
              placeholder="Your name"
              {...form.register("fullName")}
            />
            {form.formState.errors.fullName && (
              <p className="text-[0.8rem] font-medium text-destructive">
                {form.formState.errors.fullName.message}
              </p>
            )}
            {state?.errors?.fullName && (
              <p className="text-[0.8rem] font-medium text-destructive">
                {state.errors.fullName.join(", ")}
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
            Update Profile
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

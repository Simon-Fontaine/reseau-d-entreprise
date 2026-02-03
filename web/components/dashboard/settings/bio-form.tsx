"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { startTransition, useActionState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { updateBio } from "@/actions/account";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { updateBioSchema } from "@/validations/account";

type BioFormProps = {
  defaultValues: {
    bio: string | null;
  };
};

export function SettingsBioForm({ defaultValues }: BioFormProps) {
  const [state, formAction, isPending] = useActionState(updateBio, null);

  const form = useForm<z.infer<typeof updateBioSchema>>({
    resolver: zodResolver(updateBioSchema),
    defaultValues: {
      bio: defaultValues.bio ?? "",
    },
  });

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message);
      form.reset(form.getValues());
    } else if (state?.success === false) {
      toast.error(state.message);
    }
  }, [state, form]);

  function onSubmit(data: z.infer<typeof updateBioSchema>) {
    startTransition(() => {
      formAction(data);
    });
  }

  const bioValue = form.watch("bio") ?? "";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bio</CardTitle>
        <CardDescription>Share a short bio on your profile.</CardDescription>
      </CardHeader>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="space-y-4 pb-6">
          <Controller
            name="bio"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="settings-bio">Bio</FieldLabel>
                <InputGroup>
                  <InputGroupTextarea
                    {...field}
                    id="settings-bio"
                    placeholder="Tell students about your experience and teaching style."
                    rows={6}
                    className="min-h-24 resize-none"
                    aria-invalid={fieldState.invalid}
                  />
                  <InputGroupAddon align="block-end">
                    <InputGroupText className="tabular-nums">
                      {bioValue.length}/255 characters
                    </InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
                <FieldDescription>
                  Keep it concise and helpful for learners.
                </FieldDescription>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
                {state?.errors?.bio && (
                  <FieldError
                    errors={state.errors.bio.map((message) => ({ message }))}
                  />
                )}
              </Field>
            )}
          />
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button
            disabled={isPending || !form.formState.isDirty}
            className="w-full sm:w-auto"
          >
            {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
            Update Bio
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

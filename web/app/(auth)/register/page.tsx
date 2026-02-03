"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { registerAction } from "@/actions/auth";
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
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { APP_CONFIG, APP_LOGO } from "@/config";
import { registerSchema } from "@/validations/auth";

export default function RegisterPage() {
  const router = useRouter();
  const { status } = useSession();
  const toastIdRef = useRef<string | number | undefined>(undefined);

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  const { isSubmitting } = form.formState;

  async function onSubmit(data: z.infer<typeof registerSchema>) {
    toastIdRef.current = toast.loading("Signing up...");

    try {
      const result = await registerAction(null, data);

      if (!result.success) {
        if (result.errors) {
          for (const [field, messages] of Object.entries(result.errors)) {
            form.setError(field as keyof z.infer<typeof registerSchema>, {
              message: messages[0],
            });
          }
          toast.dismiss(toastIdRef.current);
        } else if (result.message === "Email already in use") {
          form.setError("email", { message: result.message });
          toast.dismiss(toastIdRef.current);
        } else {
          toast.error(result.message ?? "Registration failed", {
            id: toastIdRef.current,
          });
        }
        return;
      }

      const signInResult = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (signInResult?.error) {
        toast.error("Account created, but sign-in failed", {
          id: toastIdRef.current,
        });
        return;
      }

      toast.success("Account created!", { id: toastIdRef.current });
      router.push("/dashboard");
    } catch (_error) {
      toast.error("An error occurred. Please try again.", {
        id: toastIdRef.current,
      });
    }
  }

  return (
    <div className="bg-muted/50 flex flex-1 flex-col items-center justify-center px-4 py-8 sm:px-6 md:px-10">
      <div className="flex w-full max-w-[400px] flex-col gap-6">
        <Link href="/" className="flex items-center justify-center gap-2">
          <APP_LOGO className="size-8 text-primary" />
          <span className="text-xl font-bold">{APP_CONFIG.APP_NAME}</span>
        </Link>
        <Card className="bg-background">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Create an account</CardTitle>
            <CardDescription>Enter your details to get started</CardDescription>
          </CardHeader>
          <CardContent>
            <form id="form-register" onSubmit={form.handleSubmit(onSubmit)}>
              <FieldGroup>
                <Controller
                  name="email"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="form-register-email">
                        Email
                      </FieldLabel>
                      <Input
                        {...field}
                        id="form-register-email"
                        aria-invalid={fieldState.invalid}
                        placeholder="name@example.com"
                        autoComplete="email"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="fullName"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="form-register-full-name">
                        Full name
                      </FieldLabel>
                      <Input
                        {...field}
                        id="form-register-full-name"
                        aria-invalid={fieldState.invalid}
                        placeholder="Jane Doe"
                        autoComplete="name"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="password"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="form-register-password">
                        Password
                      </FieldLabel>
                      <PasswordInput
                        {...field}
                        id="form-register-password"
                        aria-invalid={fieldState.invalid}
                        placeholder="Create a password"
                        autoComplete="new-password"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="confirmPassword"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="form-register-confirm-password">
                        Confirm Password
                      </FieldLabel>
                      <PasswordInput
                        {...field}
                        id="form-register-confirm-password"
                        aria-invalid={fieldState.invalid}
                        placeholder="Confirm your password"
                        autoComplete="new-password"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>
            </form>
          </CardContent>
          <CardFooter>
            <Field orientation="vertical" className="w-full">
              <Button
                type="submit"
                form="form-register"
                disabled={isSubmitting}
                className="w-full"
              >
                {isSubmitting && (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                )}
                Sign up
              </Button>
              <div className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-medium text-foreground underline-offset-4 hover:underline"
                >
                  Sign in
                </Link>
              </div>
            </Field>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

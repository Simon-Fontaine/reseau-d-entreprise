"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
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
import { APP_CONFIG, APP_LOGO } from "@/config";
import { registerSchema } from "@/validations/auth";

export default function RegisterPage() {
  const router = useRouter();
  const toastIdRef = useRef<string | number | undefined>(undefined);

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

  async function onSubmit(data: z.infer<typeof registerSchema>) {
    toastIdRef.current = toast.loading("Signing up...");

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: data.fullName,
          email: data.email,
          password: data.password,
          confirmPassword: data.confirmPassword,
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        toast.error(payload?.message ?? "Registration failed", {
          id: toastIdRef.current,
        });
        return;
      }

      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result.error) {
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
    <div className="flex flex-1 flex-col items-center justify-center bg-muted/30 px-4 py-8 sm:px-6 md:px-10">
      <div className="flex w-full max-w-md flex-col gap-6">
        <Link href="/" className="flex items-center justify-center gap-2">
          <APP_LOGO className="size-6 text-primary" />
          <span className="text-xl font-bold">{APP_CONFIG.APP_NAME}</span>
        </Link>
        <Card>
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
                        placeholder="you@example.com"
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
                      <Input
                        {...field}
                        id="form-register-password"
                        type="password"
                        aria-invalid={fieldState.invalid}
                        placeholder="Enter your password"
                        autoComplete="current-password"
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
                      <Input
                        {...field}
                        id="form-register-confirm-password"
                        type="password"
                        aria-invalid={fieldState.invalid}
                        placeholder="Re-enter your password"
                        autoComplete="current-password"
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
            <Field orientation="vertical">
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
              >
                Reset
              </Button>
              <Button type="submit" form="form-register">
                Sign up
              </Button>
              <Button variant="link" asChild>
                <Link href="/login">Already have an account? Sign in</Link>
              </Button>
            </Field>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

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
import { loginSchema } from "@/validations/auth";

export default function LoginPage() {
  const router = useRouter();
  const { status } = useSession();
  const toastIdRef = useRef<string | number | undefined>(undefined);

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { isSubmitting } = form.formState;

  async function onSubmit(data: z.infer<typeof loginSchema>) {
    toastIdRef.current = toast.loading("Signing in...");

    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result.error) {
        toast.error("Invalid email or password", { id: toastIdRef.current });
      } else if (result.ok) {
        toast.success("Signed in successfully!", { id: toastIdRef.current });
        router.push("/dashboard");
      }
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
            <CardTitle className="text-xl">Welcome back</CardTitle>
            <CardDescription>
              Enter your email to sign in to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form id="form-login" onSubmit={form.handleSubmit(onSubmit)}>
              <FieldGroup>
                <Controller
                  name="email"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="form-login-email">Email</FieldLabel>
                      <Input
                        {...field}
                        id="form-login-email"
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
                  name="password"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="form-login-password">
                        Password
                      </FieldLabel>
                      <PasswordInput
                        {...field}
                        id="form-login-password"
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
              </FieldGroup>
            </form>
          </CardContent>
          <CardFooter>
            <Field orientation="vertical" className="w-full">
              <Button
                type="submit"
                form="form-login"
                disabled={isSubmitting}
                className="w-full"
              >
                {isSubmitting && (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                )}
                Sign in
              </Button>
              <div className="text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link
                  href="/register"
                  className="font-medium text-foreground underline-offset-4 hover:underline"
                >
                  Sign up
                </Link>
              </div>
            </Field>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

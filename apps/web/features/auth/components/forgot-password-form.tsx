"use client";

import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthBrand } from "@/features/auth/components/auth-brand";
import {
  authBodyClassName,
  authFooterTextClassName,
  authInlineLinkClassName,
  authInputClassName,
  authLabelClassName,
  authOutlineButtonClassName,
  authSubmitButtonClassName,
  authSubtitleClassName,
  authTitleClassName,
} from "@/features/auth/components/auth-form-styles";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

export function ForgotPasswordForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });
      if (error) throw error;
      setSuccess(true);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className={cn("w-full", className)} {...props}>
        <AuthBrand />
        <h1 className={authTitleClassName}>Check your email</h1>
        <p className={authSubtitleClassName}>Password reset instructions sent</p>
        <p className={cn(authBodyClassName, "mb-6")}>
          If you registered using your email and password, you will receive a password reset email.
        </p>
        <Button asChild variant="outline" className={authOutlineButtonClassName}>
          <Link href="/auth/login">Back to sign in</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className={cn("w-full", className)} {...props}>
      <AuthBrand />

      <form onSubmit={handleForgotPassword} className="flex flex-col" noValidate>
        <h1 className={authTitleClassName}>Reset your password</h1>
        <p className={authSubtitleClassName}>
          Enter your email and we&apos;ll send you a link to reset your password.
        </p>

        <div className="grid gap-2">
          <Label htmlFor="email" className={authLabelClassName}>
            Email
          </Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={authInputClassName}
          />
        </div>

        {error ? <p className="mt-3 text-sm text-destructive">{error}</p> : null}

        <Button type="submit" className={authSubmitButtonClassName} disabled={isLoading}>
          {isLoading ? "Sending…" : "Send reset email"}
        </Button>

        <p className={authFooterTextClassName}>
          Already have an account?{" "}
          <Link href="/auth/login" className={authInlineLinkClassName}>
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}

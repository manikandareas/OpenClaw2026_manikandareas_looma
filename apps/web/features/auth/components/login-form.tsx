"use client";

import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthBrand } from "@/features/auth/components/auth-brand";
import {
  authDividerClassName,
  authFooterTextClassName,
  authInlineLinkClassName,
  authInputClassName,
  authInputPasswordClassName,
  authLabelClassName,
  authMutedNavLinkClassName,
  authOutlineButtonClassName,
  authSubmitButtonClassName,
  authTitleClassName,
} from "@/features/auth/components/auth-form-styles";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

function GoogleMark() {
  return (
    <svg aria-hidden="true" className="size-5 shrink-0" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.37c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06L5.84 9.9C6.71 7.3 9.14 5.37 12 5.37z"
      />
    </svg>
  );
}

function AppleMark() {
  return (
    <svg aria-hidden="true" className="size-5 shrink-0 text-foreground" viewBox="0 0 24 24">
      <path
        fill="currentColor"
        d="M16.55 12.83c-.03-2.29 1.87-3.39 1.96-3.45-1.07-1.56-2.73-1.78-3.31-1.8-1.41-.14-2.75.83-3.47.83-.71 0-1.82-.81-3-.79-1.54.02-2.96.9-3.75 2.28-1.6 2.78-.41 6.89 1.15 9.14.76 1.1 1.67 2.34 2.87 2.29 1.15-.05 1.58-.74 2.98-.74 1.39 0 1.78.74 3 .72 1.24-.03 2.02-1.12 2.78-2.23.87-1.28 1.23-2.52 1.25-2.58-.03-.01-2.43-.93-2.46-3.67zM14.28 6.1c.63-.77 1.06-1.84.95-2.91-.92.04-2.03.61-2.69 1.38-.59.68-1.11 1.77-.97 2.81 1.02.08 2.08-.52 2.71-1.28z"
      />
    </svg>
  );
}

const oauthButtonClassName = cn(
  authOutlineButtonClassName,
  "relative px-4 pl-11 sm:pl-12",
);

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const canSubmit = email.trim().length > 0 && password.length > 0 && !isLoading;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      toast.success("Signed in successfully.");
      router.push("/dashboard");
      router.refresh();
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthLogin = async (provider: "google" | "apple") => {
    const supabase = createClient();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/confirm`,
        },
      });
      if (error) throw error;
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Authentication provider unavailable");
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("w-full", className)} {...props}>
      <AuthBrand />

      <form onSubmit={handleLogin} className="flex flex-col" noValidate>
        <h1 className={authTitleClassName}>Welcome back</h1>

        <div className="grid gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOAuthLogin("google")}
            disabled={isLoading}
            className={oauthButtonClassName}
          >
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 sm:left-4">
              <GoogleMark />
            </span>
            Sign in with Google
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOAuthLogin("apple")}
            disabled={isLoading}
            className={oauthButtonClassName}
          >
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 sm:left-4">
              <AppleMark />
            </span>
            Sign in with Apple
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => toast.message("SSO is not configured for this workspace.")}
            disabled={isLoading}
            className={authOutlineButtonClassName}
          >
            Sign in with SSO
          </Button>
        </div>

        <div className={authDividerClassName} />

        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email" className={authLabelClassName}>
              Email
            </Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={authInputClassName}
            />
          </div>

          <div className="grid gap-2">
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <Label htmlFor="password" className={authLabelClassName}>
                Password
              </Label>
              <Link href="/auth/forgot-password" className={authMutedNavLinkClassName}>
                Forgot your password?
              </Link>
            </div>

            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={authInputPasswordClassName}
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring sm:right-3.5"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
              </button>
            </div>
          </div>
        </div>

        <Button type="submit" disabled={!canSubmit} className={authSubmitButtonClassName}>
          {isLoading ? "Signing in..." : "Sign in"}
        </Button>

        <p className={authFooterTextClassName}>
          Don&apos;t have an account?{" "}
          <Link href="/auth/sign-up" className={authInlineLinkClassName}>
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}

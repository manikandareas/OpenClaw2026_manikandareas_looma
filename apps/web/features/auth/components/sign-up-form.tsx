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
  authFooterTextClassName,
  authInlineLinkClassName,
  authInputClassName,
  authInputPasswordClassName,
  authLabelClassName,
  authSubmitButtonClassName,
  authSubtitleClassName,
  authTitleClassName,
} from "@/features/auth/components/auth-form-styles";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

export function SignUpForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);

    if (password !== repeatPassword) {
      toast.error("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });
      if (error) throw error;
      toast.success("Account created. Check your email for confirmation.");
      router.push("/auth/sign-up-success");
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("w-full", className)} {...props}>
      <AuthBrand />

      <form onSubmit={handleSignUp} className="flex flex-col" noValidate>
        <h1 className={authTitleClassName}>Create an account</h1>
        <p className={authSubtitleClassName}>Sign up with your email and a secure password.</p>

        <div className="grid gap-4">
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

          <div className="grid gap-2">
            <Label htmlFor="password" className={authLabelClassName}>
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
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

          <div className="grid gap-2">
            <Label htmlFor="repeat-password" className={authLabelClassName}>
              Confirm password
            </Label>
            <div className="relative">
              <Input
                id="repeat-password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
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

        <Button type="submit" className={authSubmitButtonClassName} disabled={isLoading}>
          {isLoading ? "Creating account…" : "Sign up"}
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

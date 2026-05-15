"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function onSubmit(formData: FormData) {
    setIsPending(true);
    setMessage(null);

    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""
    );

    const result =
      mode === "login"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });

    setIsPending(false);

    if (result.error) {
      setMessage(result.error.message);
      return;
    }

    window.location.assign("/dashboard");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{mode === "login" ? "Login" : "Create account"}</CardTitle>
        <CardDescription>Email and password auth backed by Supabase.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={onSubmit} className="space-y-4">
          <label className="block text-sm">
            <span className="text-muted-foreground">Email</span>
            <input className="mt-1 w-full rounded-md border bg-background px-3 py-2" name="email" type="email" required />
          </label>
          <label className="block text-sm">
            <span className="text-muted-foreground">Password</span>
            <input className="mt-1 w-full rounded-md border bg-background px-3 py-2" name="password" type="password" required />
          </label>
          {message ? <p className="text-sm text-destructive">{message}</p> : null}
          <Button className="w-full" disabled={isPending} type="submit">
            {isPending ? "Working..." : mode === "login" ? "Login" : "Sign up"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

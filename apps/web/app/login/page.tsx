import Link from "next/link";
import { AuthForm } from "@/components/auth-form";

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4">
      <AuthForm mode="login" />
      <p className="mt-4 text-center text-sm text-muted-foreground">
        Need an account? <Link className="text-foreground underline" href="/signup">Sign up</Link>
      </p>
    </main>
  );
}

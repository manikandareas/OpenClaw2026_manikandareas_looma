import Link from "next/link";

import { Button } from "@/components/ui/button";
import { AuthBrand } from "@/features/auth/components/auth-brand";
import {
  authBodyClassName,
  authOutlineButtonClassName,
  authSubtitleClassName,
  authTitleClassName,
} from "@/features/auth/components/auth-form-styles";
import { cn } from "@/lib/utils";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="w-full">
      <AuthBrand />
      <h1 className={authTitleClassName}>Something went wrong</h1>
      <p className={authSubtitleClassName}>We couldn&apos;t complete that sign-in request.</p>
      {params?.error ? (
        <p className={cn(authBodyClassName, "mb-2 font-mono text-xs")}>Code: {params.error}</p>
      ) : null}
      <p className={cn(authBodyClassName, "mb-6")}>
        {params?.error
          ? "Try again, or use a different sign-in method."
          : "An unspecified error occurred. Try signing in again."}
      </p>
      <Button asChild variant="outline" className={authOutlineButtonClassName}>
        <Link href="/auth/login">Back to sign in</Link>
      </Button>
    </div>
  );
}

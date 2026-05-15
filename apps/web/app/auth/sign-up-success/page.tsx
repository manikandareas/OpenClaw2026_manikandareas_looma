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

export default function Page() {
  return (
    <div className="w-full">
      <AuthBrand />
      <h1 className={authTitleClassName}>Thanks for signing up</h1>
      <p className={authSubtitleClassName}>Check your email to confirm your account.</p>
      <p className={cn(authBodyClassName, "mb-6")}>
        We sent a confirmation link. After you confirm, you can sign in with your email and
        password.
      </p>
      <Button asChild variant="outline" className={authOutlineButtonClassName}>
        <Link href="/auth/login">Back to sign in</Link>
      </Button>
    </div>
  );
}

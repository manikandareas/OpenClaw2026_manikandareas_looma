import Link from "next/link";
import { Button } from "@/components/ui/button";
import { NavLinks } from "@/features/app-shell/components/nav-links";
import { UserNav } from "@/features/app-shell/components/user-nav";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function AppNav() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <header className="relative border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="text-sm font-semibold tracking-normal">
          Looma
        </Link>
        <nav className="flex items-center gap-1">
          <NavLinks />
          {user ? (
            <UserNav email={user.email ?? ""} />
          ) : (
            <Button asChild size="sm">
              <Link href="/auth/login">Login</Link>
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { NavLinks } from "@/features/app-shell/components/nav-links";
import { ThemeToggle } from "@/features/app-shell/components/theme-toggle";
import { UserNav } from "@/features/app-shell/components/user-nav";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function AppNav() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <header className="relative bg-background">
      <div className="mx-auto flex h-16 max-w-[1000px] items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center justify-center">
            <span className="text-lg font-bold">Looma</span>
          </Link>
        </div>
        
        <nav className="flex items-center gap-1">
          <NavLinks />
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          {user ? (
            <UserNav email={user.email ?? ""} />
          ) : (
            <Button asChild size="sm">
              <Link href="/auth/login">Login</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

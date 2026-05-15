import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UserNav } from "@/features/app-shell/components/user-nav";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const links = [
  ["Dashboard", "/dashboard"],
  ["Sessions", "/sessions"],
  ["Import", "/import"]
] as const;

export async function AppNav() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <header className="border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="text-sm font-semibold tracking-normal">
          Looma
        </Link>
        <nav className="flex items-center gap-1">
          {links.map(([label, href]) => (
            <Button key={href} asChild variant="ghost" size="sm">
              <Link href={href}>{label}</Link>
            </Button>
          ))}
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

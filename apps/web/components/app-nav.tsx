import Link from "next/link";
import { Button } from "@/components/ui/button";

const links = [
  ["Dashboard", "/dashboard"],
  ["Sessions", "/sessions"],
  ["Import", "/import"]
] as const;

export function AppNav() {
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
        </nav>
      </div>
    </header>
  );
}

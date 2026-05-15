"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const links = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Sessions", href: "/sessions" },
  { label: "Docs", href: "/docs" },
] as const;

export function NavLinks() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <div className="hidden items-center gap-1 sm:flex">
        {links.map(({ label, href }) => {
          const isActive = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Button
              key={href}
              asChild
              variant={isActive ? "secondary" : "ghost"}
              size="sm"
            >
              <Link href={href}>{label}</Link>
            </Button>
          );
        })}
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="sm:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </Button>
      {mobileOpen && (
        <div className="absolute left-0 top-14 z-50 w-full border-b bg-background p-4 sm:hidden">
          <div className="flex flex-col gap-1">
            {links.map(({ label, href }) => {
              const isActive = pathname === href || pathname.startsWith(`${href}/`);
              return (
                <Button
                  key={href}
                  asChild
                  variant={isActive ? "secondary" : "ghost"}
                  size="sm"
                  className="justify-start"
                  onClick={() => setMobileOpen(false)}
                >
                  <Link href={href}>{label}</Link>
                </Button>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}

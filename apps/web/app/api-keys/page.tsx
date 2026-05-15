import type { Metadata } from "next";
import { AppNav } from "@/features/app-shell/components/app-nav";
import { ApiKeysPageContent } from "@/features/dashboard/components/api-keys-page-content";
import { getAppUrl } from "@/lib/env";

export const metadata: Metadata = {
  title: "API Keys | Looma",
  description: "Create Looma API keys and connect Claude Code through the public looma-agent beta.",
};

export default function ApiKeysPage() {
  const appUrl = getAppUrl();

  return (
    <div className="min-h-screen bg-background pb-12">
      <AppNav />
      <ApiKeysPageContent appUrl={appUrl} />
    </div>
  );
}

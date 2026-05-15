import { AppNav } from "@/features/app-shell/components/app-nav";
import { ApiKeysPageContent } from "@/features/dashboard/components/api-keys-page-content";
import { getAppUrl } from "@/lib/env";

export default function ApiKeysPage() {
  const appUrl = getAppUrl();

  return (
    <div className="min-h-screen bg-background pb-12">
      <AppNav />
      <ApiKeysPageContent appUrl={appUrl} />
    </div>
  );
}

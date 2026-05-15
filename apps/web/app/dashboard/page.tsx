import { Activity, Import, Radio } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AppNav } from "@/features/app-shell/components/app-nav";

const stats = [
  { label: "Sessions", value: "0", icon: Activity },
  { label: "Recording", value: "Ready", icon: Radio },
  { label: "Review markers", value: "0", icon: Activity }
];

export default function DashboardPage() {
  return (
    <>
      <AppNav />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-normal">Dashboard</h1>
            <p className="mt-2 text-muted-foreground">Recent sessions, activity, and recording entry points.</p>
          </div>
          <Button asChild>
            <Link href="/import"><Import className="h-4 w-4" /> Import</Link>
          </Button>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {stats.map(({ label, value, icon: Icon }) => (
            <Card key={label}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Icon className="h-4 w-4" /> {label}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-3xl font-semibold">{value}</CardContent>
            </Card>
          ))}
        </div>
      </main>
    </>
  );
}

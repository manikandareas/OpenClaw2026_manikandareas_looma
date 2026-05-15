import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AppNav } from "@/features/app-shell/components/app-nav";
import { getReplayPreview } from "@/features/replay/api/get-replay-preview";
import { ReplayShell } from "@/features/replay/components/replay-shell";
import { buildSessionUrl } from "@/features/replay/utils/share";

type ReplayPageProps = {
  params: Promise<{ sessionId: string }>;
  searchParams: Promise<{ embed?: string | string[] }>;
};

export async function generateMetadata({ params }: Pick<ReplayPageProps, "params">): Promise<Metadata> {
  const { sessionId } = await params;
  const preview = await getReplayPreview(sessionId);

  if (!preview) {
    return {
      title: "Replay not found | Looma",
    };
  }

  const title = `${preview.title} | Looma Replay`;
  const description = [
    `${preview.harness} session with ${preview.eventCount} events`,
    `${preview.markerCount} review markers`,
    preview.firstReviewLabel ? `first review: ${preview.firstReviewLabel}` : null,
  ].filter(Boolean).join(", ");
  const url = buildSessionUrl(sessionId);

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      type: "article",
      url,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function ReplayPage({ params, searchParams }: ReplayPageProps) {
  const [{ sessionId }, query] = await Promise.all([params, searchParams]);

  if (!sessionId) {
    notFound();
  }

  const embedded = asSingleValue(query.embed) === "1";
  const autoPlay = sessionId === "demo";

  return (
    <>
      {embedded ? null : <AppNav />}
      <main className={embedded ? "px-3 py-3" : "mx-auto max-w-7xl px-4 py-6"}>
        <ReplayShell sessionId={sessionId} autoPlay={autoPlay} embedded={embedded} />
      </main>
    </>
  );
}

function asSingleValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

import { ImageResponse } from "next/og";
import { getReplayPreview } from "@/features/replay/api/get-replay-preview";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

type OpenGraphImageProps = {
  params: Promise<{ sessionId: string }>;
};

export default async function Image({ params }: OpenGraphImageProps) {
  const { sessionId } = await params;
  const preview = await getReplayPreview(sessionId);
  const title = preview?.title ?? "Looma replay";
  const reviewLabel = preview?.firstReviewLabel ?? "Replay-native review for agent sessions";

  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "stretch",
          background: "#09090b",
          color: "#fafafa",
          display: "flex",
          flexDirection: "column",
          fontFamily: "Inter, sans-serif",
          height: "100%",
          justifyContent: "space-between",
          padding: "72px",
          width: "100%",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 28 }}>
          <span>Looma Replay</span>
          <span style={{ color: "#a1a1aa" }}>{preview?.harness ?? "agent"}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              color: "#a1a1aa",
              display: "flex",
              fontSize: 30,
              marginBottom: 24,
            }}
          >
            {preview?.eventCount ?? 0} events / {preview?.markerCount ?? 0} review markers
          </div>
          <div style={{ display: "flex", fontSize: 72, fontWeight: 700, lineHeight: 1.05 }}>
            {title}
          </div>
          <div style={{ color: "#fbbf24", display: "flex", fontSize: 34, marginTop: 28 }}>
            {reviewLabel}
          </div>
        </div>
        <div style={{ color: "#71717a", display: "flex", fontSize: 24 }}>/sessions/{sessionId}</div>
      </div>
    ),
    size
  );
}

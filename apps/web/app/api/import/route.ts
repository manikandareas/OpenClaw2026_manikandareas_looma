export const runtime = "nodejs";

export async function POST() {
  return Response.json(
    { error: "Transcript import is disabled for this phase." },
    { status: 410 }
  );
}

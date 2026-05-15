import { processSessionInputSchema } from "@looma/shared";
import { runLensAgent } from "@/features/lens-agent/api/run-lens-agent";
import { getApiActor, unauthorized } from "@/lib/api/auth";

export const runtime = "nodejs";
export const maxDuration = 60;

type RouteContext = {
  params: Promise<{ sessionId: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  const actor = await getApiActor(request);
  if (!actor) {
    return unauthorized();
  }

  const input = processSessionInputSchema.parse(await request.json().catch(() => ({})));
  const { sessionId } = await context.params;

  try {
    const result = await runLensAgent({
      sessionId,
      userId: actor.userId,
      force: input.force,
    });

    return Response.json(result);
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Failed to process session" },
      { status: 500 }
    );
  }
}

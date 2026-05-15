import type { Example, GetExamplesParams } from "@/features/example-feature/types/example";

export async function getExamples(params: GetExamplesParams = {}): Promise<Example[]> {
  const limit = params.limit ?? 10;
  return Array.from({ length: limit }, (_, index) => ({
    id: `example-${index + 1}`,
    title: `Example ${index + 1}`,
    createdAt: new Date(0).toISOString()
  }));
}

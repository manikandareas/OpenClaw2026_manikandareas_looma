import { getExamples } from "@/features/example-feature/api/get-examples";
import type { GetExamplesParams } from "@/features/example-feature/types/example";

type ExampleListProps = {
  params?: GetExamplesParams;
};

export async function ExampleList({ params }: ExampleListProps) {
  const examples = await getExamples(params);

  return (
    <ul className="space-y-1 text-sm">
      {examples.map((example) => (
        <li key={example.id} className="text-muted-foreground">
          {example.title}
        </li>
      ))}
    </ul>
  );
}

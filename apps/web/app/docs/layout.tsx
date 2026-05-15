import type { ReactNode } from "react";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { source } from "@/lib/docs-source";

export default function DocsRootLayout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      tree={source.getPageTree()}
      nav={{ title: "Looma Docs", url: "/docs" }}
      githubUrl="https://github.com/manikandareas/OpenClaw2026_manikandareas_looma"
      sidebar={{ prefetch: false }}
    >
      {children}
    </DocsLayout>
  );
}

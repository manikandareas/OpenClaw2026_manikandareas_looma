import { getAppUrl } from "@/lib/env";

type EmbedSnippetInput = {
  sessionId: string;
  title: string;
  origin?: string;
};

export function buildSessionUrl(sessionId: string, origin = getAppUrl()): string {
  return new URL(
    `/sessions/${encodeURIComponent(sessionId)}`,
    ensureTrailingSlash(origin)
  ).toString();
}

export function buildEmbedUrl(sessionId: string, origin = getAppUrl()): string {
  const url = new URL(`/sessions/${encodeURIComponent(sessionId)}`, ensureTrailingSlash(origin));
  url.searchParams.set("embed", "1");
  return url.toString();
}

export function buildEmbedSnippet({ sessionId, title, origin }: EmbedSnippetInput): string {
  const src = buildEmbedUrl(sessionId, origin);
  const escapedTitle = escapeHtmlAttribute(`${title} replay`);

  return `<iframe src="${escapeHtmlAttribute(src)}" title="${escapedTitle}" width="100%" height="720" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" style="border:0;border-radius:8px;overflow:hidden"></iframe>`;
}

function ensureTrailingSlash(origin: string): string {
  return origin.endsWith("/") ? origin : `${origin}/`;
}

function escapeHtmlAttribute(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("\"", "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

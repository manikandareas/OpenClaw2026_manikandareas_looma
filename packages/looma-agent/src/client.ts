import type { CreateSessionInput, FinalOutputInput, NormalizedEventInput } from "./schemas";

const DEFAULT_LOOMA_API_URL = "https://looma-gold.vercel.app";

export class LoomaApiClient {
  private readonly apiUrl: string;
  private readonly apiKey: string;

  constructor(options: { apiUrl?: string; apiKey?: string } = {}) {
    const apiUrl = options.apiUrl ?? process.env.LOOMA_API_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? DEFAULT_LOOMA_API_URL;
    this.apiUrl = apiUrl.replace(/\/$/, "");
    this.apiKey = options.apiKey ?? process.env.LOOMA_API_KEY ?? "";

    if (!this.apiKey) {
      throw new Error("Missing LOOMA_API_KEY");
    }
  }

  async createSession(input: CreateSessionInput) {
    return this.request("/api/sessions", {
      method: "POST",
      body: JSON.stringify(input),
    });
  }

  async recordEvent(sessionId: string, input: NormalizedEventInput) {
    return this.request(`/api/sessions/${sessionId}/events`, {
      method: "POST",
      body: JSON.stringify(input),
    });
  }

  async stopSession(sessionId: string, input: { finalOutput?: FinalOutputInput } = {}) {
    return this.request(`/api/sessions/${sessionId}/stop`, {
      method: "POST",
      body: JSON.stringify(input),
    });
  }

  async doctor() {
    return this.request("/api/sessions", {
      method: "GET",
    });
  }

  private async request(path: string, init: RequestInit) {
    const response = await fetch(`${this.apiUrl}${path}`, {
      ...init,
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${this.apiKey}`,
        ...init.headers,
      },
    });

    const responseText = await response.text();
    const json = parseJson(responseText);

    if (!response.ok) {
      const detail = getErrorDetail(json, responseText);
      const method = init.method ?? "GET";
      const errorMessage = `Looma API ${method} ${path} returned ${response.status}${detail ? `: ${detail}` : ""}`;
      throw new Error(errorMessage);
    }

    return json;
  }
}

function parseJson(text: string): unknown {
  if (!text.trim()) return {};

  try {
    return JSON.parse(text);
  } catch {
    return {};
  }
}

function getErrorDetail(json: unknown, responseText: string): string {
  if (json && typeof json === "object" && "error" in json && typeof json.error === "string") {
    return json.error;
  }

  return responseText.trim().slice(0, 500);
}

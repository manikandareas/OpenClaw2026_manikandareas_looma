import type { CreateSessionInput, FinalOutputInput, NormalizedEventInput } from "./schemas";

export class LoomaApiClient {
  private readonly apiUrl: string;
  private readonly apiKey: string;

  constructor(options: { apiUrl?: string; apiKey?: string } = {}) {
    this.apiUrl = (options.apiUrl ?? process.env.LOOMA_API_URL ?? "http://localhost:3000").replace(/\/$/, "");
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

    const json: unknown = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMessage =
        json && typeof json === "object" && "error" in json && typeof json.error === "string"
          ? json.error
          : `Looma API returned ${response.status}`;
      throw new Error(errorMessage);
    }

    return json;
  }
}

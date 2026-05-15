export type SessionStatus =
  | "recording"
  | "processing"
  | "replay_ready"
  | "failed"
  | "stopped";

export type SessionCard = {
  id: string;
  name: string;
  status: SessionStatus;
  harness: string;
  agentName: string | null;
  durationMs: number | null;
  markerCount: number;
  createdAt: string;
  startedAt: string;
  endedAt: string | null;
};

export type GetSessionsParams = {
  status?: SessionStatus;
  limit?: string;
  offset?: string;
  search?: string;
};

export type GetSessionsResponse = {
  sessions: SessionCard[];
  total: number;
  limit: number;
  offset: number;
};

"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export type ApiKeyMetadata = {
  id: string;
  name: string;
  createdAt: string;
  lastUsedAt: string | null;
  revokedAt: string | null;
};

export type CreatedApiKey = {
  id: string;
  name: string;
  token: string;
  createdAt: string;
};

async function fetchApiKeys(): Promise<{ keys: ApiKeyMetadata[] }> {
  const res = await fetch("/api/api-keys");
  if (!res.ok) throw new Error("Failed to fetch API keys");
  return res.json();
}

async function createApiKey(name: string): Promise<CreatedApiKey> {
  const res = await fetch("/api/api-keys", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ name })
  });

  if (!res.ok) throw new Error("Failed to create API key");
  return res.json();
}

async function revokeApiKey(id: string): Promise<{ id: string; revokedAt: string }> {
  const res = await fetch(`/api/api-keys/${id}/revoke`, {
    method: "POST"
  });

  if (!res.ok) throw new Error("Failed to revoke API key");
  return res.json();
}

export function useApiKeys() {
  return useQuery({
    queryKey: ["api-keys"],
    queryFn: fetchApiKeys
  });
}

export function useCreateApiKey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createApiKey,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["api-keys"] })
  });
}

export function useRevokeApiKey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: revokeApiKey,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["api-keys"] })
  });
}

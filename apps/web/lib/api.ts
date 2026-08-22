/**
 * Minimal API client for the FastAPI backend (apps/api).
 *
 * The base URL is configurable via NEXT_PUBLIC_API_BASE_URL so the same code
 * works in local development and future deployments. No extra HTTP client is
 * needed: the browser's native fetch is sufficient.
 */

export type Research = {
  id: string;
  name: string;
  seed_keyword: string;
  description: string | null;
  country_code: string;
  language_code: string;
  status: string;
  created_at: string;
  updated_at: string;
};

export type CreateResearchInput = {
  name: string;
  seed_keyword: string;
  description?: string | null;
  country_code: string;
  language_code: string;
};

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export class ApiError extends Error {
  readonly status: number;
  readonly detail: unknown;

  constructor(status: number, message: string, detail: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.detail = detail;
  }
}

export async function createResearch(
  input: CreateResearchInput,
): Promise<Research> {
  const response = await fetch(`${API_BASE_URL}/api/researches`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (response.status === 201) {
    return (await response.json()) as Research;
  }

  let detail: unknown = null;
  try {
    const body = (await response.json()) as { detail?: unknown };
    detail = body.detail ?? null;
  } catch {
    // Non-JSON error responses are handled with the generic message.
  }

  throw new ApiError(
    response.status,
    `Failed to create research (HTTP ${response.status})`,
    detail,
  );
}

export type ResearchJob = {
  id: string;
  research_id: string;
  status: string;
  started_at: string | null;
  finished_at: string | null;
  error_message: string | null;
  created_at: string;
  updated_at: string;
};

export type ResearchJobList = {
  items: ResearchJob[];
};

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, init);

  if (response.ok) {
    return (await response.json()) as T;
  }

  let detail: unknown = null;
  try {
    const body = (await response.json()) as { detail?: unknown };
    detail = body.detail ?? null;
  } catch {
    // Non-JSON error responses are handled with the generic message.
  }

  throw new ApiError(
    response.status,
    `Request to ${path} failed (HTTP ${response.status})`,
    detail,
  );
}

export async function getResearch(researchId: string): Promise<Research> {
  return requestJson<Research>(`/api/researches/${researchId}`);
}

export async function getResearchJobs(
  researchId: string,
): Promise<ResearchJobList> {
  return requestJson<ResearchJobList>(
    `/api/researches/${researchId}/jobs`,
  );
}

export async function runResearch(researchId: string): Promise<ResearchJob> {
  return requestJson<ResearchJob>(`/api/researches/${researchId}/run`, {
    method: "POST",
  });
}

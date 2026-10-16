import { config } from "./config";

export function artifactUrl(id: string) { return `${config.apiUrl}/artifacts/${encodeURIComponent(id)}`; }

export type Application = { id: string; name: string; baseUrl: string; environment: "development" | "staging" | "production"; createdAt: string };
export type Run = { id: string; applicationId: string; status: string; targetUrl: string; failureReason: string | null; createdAt: string; completedAt: string | null };
export type Result = { id: string; status: string; checkName: string; message: string; detail: unknown; durationMs: number | null; createdAt: string };
export type Issue = { id: string; title: string; expectedBehavior: string; actualBehavior: string; prerequisites: string | null; status: string; runId: string | null; resultId: string | null; createdAt: string };

export async function apiRequest(path: string, options?: RequestInit) {
  const response = await fetch(`${config.apiUrl}${path}`, { credentials: "include", ...options });
  if (!response.ok) throw new Error(`Request failed (${response.status})`);
  return response;
}

async function trpc<T>(path: string, input?: unknown, method: "GET" | "POST" = "GET"): Promise<T> {
  const response = await apiRequest(method === "GET" ? `/trpc/${path}?input=${encodeURIComponent(JSON.stringify(input ?? null))}` : `/trpc/${path}`, method === "POST" ? { method, headers: { "content-type": "application/json" }, body: JSON.stringify(input ?? {}) } : undefined);
  const body = await response.json() as { result?: { data?: T }; error?: { message?: string } };
  if (body.error) throw new Error(body.error.message ?? "The request could not be completed");
  if (body.result?.data === undefined) throw new Error("Unexpected API response");
  return body.result.data;
}

export const api = {
  health: () => apiRequest("/healthz").then((response) => response.json() as Promise<{ status: "ok" }>),
  establishLocalDemoSession: () => apiRequest("/local-demo/session", { method: "POST" }),
  applications: {
    list: () => trpc<Application[]>("applications.list"),
    create: (input: { name: string; baseUrl: string; environment: Application["environment"]; testingAuthorization: true }) => trpc<Application>("applications.create", input, "POST"),
    archive: (id: string) => trpc<Application>("applications.archive", { id }, "POST"),
  },
  runs: {
    list: () => trpc<Run[]>("runs.list"),
    start: (applicationId: string) => trpc<Run>("runs.start", { applicationId, idempotencyKey: crypto.randomUUID() }, "POST"),
    results: (runId: string) => trpc<{ run: Run; results: Result[]; artifacts: { id: string; kind: string; createdAt: string }[] }>("runs.results", { runId }),
  },
  issues: {
    list: () => trpc<Issue[]>("issues.list"),
    create: (input: { title: string; expectedBehavior: string; actualBehavior: string; prerequisites?: string; runId?: string; resultId?: string }) => trpc<Issue>("issues.create", input, "POST"),
  },
};

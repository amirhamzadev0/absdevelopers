export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
    readonly fields: Record<string, string> = {},
  ) {
    super(message);
  }
}

interface ApiBody<T> {
  data?: T;
  error?: { message: string; fields?: Record<string, string> };
}

type ApiInit = RequestInit & { query?: Record<string, string | number | undefined> };

/** Calls /api/<operation> and returns `body.data`, throwing ApiError on failure. */
export async function apiRequest<T>(operation: string, init: ApiInit = {}): Promise<T> {
  const { query, ...rest } = init;
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined && value !== "") params.set(key, String(value));
  }
  const search = params.toString();
  const response = await fetch(`/api/${operation}${search ? `?${search}` : ""}`, {
    ...rest,
    headers: { "Content-Type": "application/json", ...rest.headers },
  });
  const body = (await response.json().catch(() => ({}))) as ApiBody<T>;
  if (!response.ok || body.data === undefined) {
    throw new ApiError(
      response.status,
      body.error?.message ?? "Request failed.",
      body.error?.fields ?? {},
    );
  }
  return body.data;
}

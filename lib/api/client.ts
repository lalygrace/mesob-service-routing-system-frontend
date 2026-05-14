const DEFAULT_API_BASE_URL = "http://localhost:8888";

export type ApiEnvelope<T> = {
  data: T;
};

export type ApiRequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
};

export class ApiError extends Error {
  status: number;
  details: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

export function getApiBaseUrl() {
  const configured = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  return configured && configured.length > 0
    ? configured.replace(/\/$/, "")
    : DEFAULT_API_BASE_URL;
}

function isFormData(value: unknown): value is FormData {
  return typeof FormData !== "undefined" && value instanceof FormData;
}

function buildHeaders(body: unknown, headers?: HeadersInit): Headers {
  const nextHeaders = new Headers(headers);

  if (body !== undefined && !isFormData(body) && !nextHeaders.has("Content-Type")) {
    nextHeaders.set("Content-Type", "application/json");
  }

  if (!nextHeaders.has("Accept")) {
    nextHeaders.set("Accept", "application/json");
  }

  return nextHeaders;
}

function serializeBody(body: unknown): BodyInit | null | undefined {
  if (body === undefined) return undefined;
  if (body === null) return null;
  if (isFormData(body)) return body;
  if (typeof body === "string") return body;
  return JSON.stringify(body);
}

async function parseResponse(response: Response): Promise<unknown> {
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    const text = await response.text();
    return text.length > 0 ? text : null;
  }

  try {
    return await response.json();
  } catch {
    return null;
  }
}

function extractErrorMessage(payload: unknown, fallback: string): string {
  if (!payload || typeof payload !== "object") return fallback;

  const record = payload as Record<string, unknown>;
  const message = record.message;

  if (typeof message === "string") return message;
  if (Array.isArray(message)) return message.filter(Boolean).join(". ");

  const error = record.error;
  if (typeof error === "string") return error;

  return fallback;
}

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    ...options,
    headers: buildHeaders(options.body, options.headers),
    body: serializeBody(options.body),
    credentials: "include",
  });

  const payload = await parseResponse(response);

  if (!response.ok) {
    throw new ApiError(
      extractErrorMessage(payload, `Request failed with status ${response.status}`),
      response.status,
      payload,
    );
  }

  return payload as T;
}

export async function apiData<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const payload = await apiRequest<ApiEnvelope<T> | T>(path, options);

  if (payload && typeof payload === "object" && "data" in payload) {
    return (payload as ApiEnvelope<T>).data;
  }

  return payload as T;
}

export function getApiErrorMessage(error: unknown, fallback = "Something went wrong") {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error) return error.message;
  return fallback;
}

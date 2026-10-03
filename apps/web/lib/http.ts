export type QueryParams = Record<
  string,
  string | number | boolean | null | undefined
>

export type FetchOptions = Omit<RequestInit, "body"> & {
  queryParams?: QueryParams
  body?: unknown
}

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
    readonly data?: unknown
  ) {
    super(message)
  }
}

function withQueryParams(url: string, queryParams?: QueryParams) {
  const qs = new URLSearchParams()
  for (const [key, value] of Object.entries(queryParams ?? {})) {
    if (value !== undefined && value !== null) qs.append(key, String(value))
  }
  const query = qs.toString()
  return query ? `${url}?${query}` : url
}

function isRawBody(body: unknown): body is BodyInit {
  return (
    typeof body === "string" ||
    body instanceof FormData ||
    body instanceof Blob ||
    body instanceof URLSearchParams
  )
}

/** Nest's error body is `{ message: string | string[] }`. */
function errorMessage(data: unknown): string | undefined {
  if (typeof data !== "object" || data === null || !("message" in data)) {
    return undefined
  }
  const { message } = data
  if (Array.isArray(message)) return message.join(", ")
  return typeof message === "string" ? message : undefined
}

/**
 * fetch() with query params, JSON bodies and JSON responses.
 * Throws ApiError on a non-2xx response.
 */
export async function request<T>(
  url: string,
  { queryParams, body, headers, ...init }: FetchOptions = {}
): Promise<T> {
  const fullUrl = withQueryParams(url, queryParams)
  const finalHeaders = new Headers(headers)

  let finalBody: BodyInit | undefined
  if (body === undefined || isRawBody(body)) {
    finalBody = body
  } else {
    finalBody = JSON.stringify(body)
    finalHeaders.set("Content-Type", "application/json")
  }

  const res = await fetch(fullUrl, {
    ...init,
    headers: finalHeaders,
    body: finalBody,
  })

  const text = await res.text()
  let data: unknown
  try {
    data = text ? JSON.parse(text) : undefined
  } catch {
    data = text
  }

  if (!res.ok) {
    const method = init.method ?? "GET"
    throw new ApiError(
      res.status,
      errorMessage(data) ?? `${method} ${fullUrl} failed (${res.status})`,
      data
    )
  }
  return data as T
}

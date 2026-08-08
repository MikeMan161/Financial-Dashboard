import { API_URL } from "./config";

export class AuthError extends Error {
    constructor(message = "Unauthorized") {
        super(message)
        this.name = "AuthError"
    }
}

export async function apiFetch(
  path: string,
  token: string | null,
  options: RequestInit = {}
): Promise<Response> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...options.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  })

  if (response.status === 401) {
    throw new AuthError()
  }

  if (!response.ok) {
    // FastAPI puts the human-readable reason in `detail`, so surface it instead of a bare
    // status code. Pydantic's 422 bodies use an array of field errors there rather than a
    // string, and those aren't worth showing raw — fall back to the status for those.
    let detail = ""
    try {
      const body = await response.json()
      if (typeof body?.detail === "string") detail = body.detail
    } catch {
      // Error body wasn't JSON; the status code is all we have.
    }
    throw new Error(detail || `Request failed: ${response.status}`)
  }

  return response
}
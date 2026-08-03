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
    throw new Error(`Request failed: ${response.status}`)
  }

  return response
}
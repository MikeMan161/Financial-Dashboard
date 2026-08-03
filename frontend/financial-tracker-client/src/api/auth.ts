import { API_URL } from "./config";

// Deliberately does not use apiFetch: a 401 here means "wrong credentials",
// not an expired session, so it must not raise AuthError.
export async function login(email: string, password: string): Promise<string> {
    const body = new URLSearchParams();
    body.append("username", email);
    body.append("password", password);

    const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body,
    });

    if (!response.ok) {
        throw new Error("Login failed");
    }

    const data = await response.json();
    return data.access_token;
}

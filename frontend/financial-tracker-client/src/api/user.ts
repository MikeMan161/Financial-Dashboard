import { API_URL } from "./config"

export type UserResponse = {
    id: string 
    username: string
    email: string
    created_at: string
    currency: string
}

export async function getUser(token: string): Promise<UserResponse> {
    const response = await fetch(`${API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Failed to fetch user");
    return response.json();
}
import { API_URL } from "../api/config"
import type { MessageResponse } from "../api/types"

export type UserResponse = {
    id: string;
    username: string;
    email: string;
    currency: string;
}
export type UpdatePasswordRequest = {
    current_password: string;
    new_password: string;
}

export async function getUser(token: string): Promise<UserResponse> {
    const response = await fetch(`${API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Could not retrieve user");
    return response.json();
}

//Ignore /users/currencies right now as it'll return a large list of currencies

export async function updateCurrency(token: string, currency: string): Promise<UserResponse> {
    const response = await fetch(`${API_URL}/users/me/currency`, {
        method: 'PATCH',
        headers: { 
            Authorization: `Bearer ${token}`, 
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ currency }),
    });
    if (!response.ok) throw new Error("Could not update currency");
    return response.json();
}

export async function updatePassword(token: string, request: UpdatePasswordRequest ): Promise<MessageResponse> {
    const response = await fetch(`${API_URL}/users/me/password`, {
        method: 'PATCH',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(request),
    });
    if (!response.ok) throw new Error("Could not update password");
    return response.json();
}
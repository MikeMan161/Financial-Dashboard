import { API_URL } from "./config";

export type IncomeResponse = {
    id: string;
    user_id: string;
    amount: number;
    description: string | null;
    source: string | null;
    frequency: string;
    income_date: string;
}

export type CreateIncome = {
    amount: number;
    description?: string | null;
    source?: string | null;
    frequency: string;
    income_date: string;
}

export type UpdateIncome = {
    amount: number;
    description?: string | null;
    source?: string | null;
    frequency: string;
    income_date: string;
}

export async function getIncome(token: string): Promise<IncomeResponse[]> {
    const response = await fetch(`${API_URL}/income`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Could not get income")
    return response.json();
}

export async function getOneIncome(token: string, id: string): Promise<IncomeResponse> {
    const response = await fetch(`${API_URL}/income/${id}`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Could not get income entry")
    return response.json();
}

export async function getDeletedIncome(token: string): Promise<IncomeResponse[]> {
    const response = await fetch(`${API_URL}/income/deleted`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Could not get deleted income")
    return response.json();
}

export async function createIncome(token: string, request: CreateIncome): Promise<IncomeResponse> {
    const response = await fetch(`${API_URL}/income`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
    });
    if (!response.ok) throw new Error("Could not create income")
    return response.json();
}

export async function updateIncome(token: string, id: string, request: UpdateIncome): Promise<IncomeResponse> {
    const response = await fetch(`${API_URL}/income/${id}`, {
        method: 'PATCH',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
    });
    if (!response.ok) throw new Error("Could not update income")
    return response.json();
}

export async function deleteIncome(token: string, id: string): Promise<IncomeResponse> {
    const response = await fetch(`${API_URL}/income/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Could not delete income")
    return response.json();
}

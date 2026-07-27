import { API_URL } from "./config";

export type DebtResponse = {
    id: string;
    user_id: string;
    name: string;
    current_balance: number;
    apr: number;
    minimum_payment: number;
    due_date: string;
}

export type CreateDebt = {
    name: string;
    current_balance: number;
    apr: number;
    minimum_payment: number;
    due_date: string;
}

export type UpdateDebt = {
    name: string;
    current_balance: number;
    apr: number;
    minimum_payment: number;
    due_date: string;
}

export async function getDebts(token: string): Promise<DebtResponse[]> {
    const response = await fetch(`${API_URL}/debts`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Could not get debts")
    return response.json();
}

export async function getOneDebt(token: string, id: string): Promise<DebtResponse> {
    const response = await fetch(`${API_URL}/debts/${id}`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Could not get debt")
    return response.json();
}

export async function getDeletedDebts(token: string): Promise<DebtResponse[]> {
    const response = await fetch(`${API_URL}/debts/deleted`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Could not get deleted debts")
    return response.json();
}

export async function createDebt(token: string, request: CreateDebt): Promise<DebtResponse> {
    const response = await fetch(`${API_URL}/debts`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
    });
    if (!response.ok) throw new Error("Could not create debt")
    return response.json();
}

export async function updateDebt(token: string, id: string, request: UpdateDebt): Promise<DebtResponse> {
    const response = await fetch(`${API_URL}/debts/${id}`, {
        method: 'PATCH',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
    });
    if (!response.ok) throw new Error("Could not update debt")
    return response.json();
}

export async function deleteDebt(token: string, id: string): Promise<DebtResponse> {
    const response = await fetch(`${API_URL}/debts/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Could not delete debt")
    return response.json();
}

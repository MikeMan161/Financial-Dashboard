import { apiFetch } from "./client";

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
    const response = await apiFetch(`/debts`, token, {
        method: 'GET',
    });
    return response.json();
}

export async function getOneDebt(token: string, id: string): Promise<DebtResponse> {
    const response = await apiFetch(`/debts/${id}`, token, {
        method: 'GET',
    });
    return response.json();
}

export async function getDeletedDebts(token: string): Promise<DebtResponse[]> {
    const response = await apiFetch(`/debts/deleted`, token, {
        method: 'GET',
    });
    return response.json();
}

export async function createDebt(token: string, request: CreateDebt): Promise<DebtResponse> {
    const response = await apiFetch(`/debts`, token, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
    });
    return response.json();
}

export async function updateDebt(token: string, id: string, request: UpdateDebt): Promise<DebtResponse> {
    const response = await apiFetch(`/debts/${id}`, token, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
    });
    return response.json();
}

export async function deleteDebt(token: string, id: string): Promise<DebtResponse> {
    const response = await apiFetch(`/debts/${id}`, token, {
        method: 'DELETE',
    });
    return response.json();
}

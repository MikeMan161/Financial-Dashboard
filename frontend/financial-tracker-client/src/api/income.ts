import { apiFetch } from "./client";

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
    const response = await apiFetch(`/income`, token, {
        method: 'GET',
    });
    return response.json();
}

export async function getOneIncome(token: string, id: string): Promise<IncomeResponse> {
    const response = await apiFetch(`/income/${id}`, token, {
        method: 'GET',
    });
    return response.json();
}

export async function getDeletedIncome(token: string): Promise<IncomeResponse[]> {
    const response = await apiFetch(`/income/deleted`, token, {
        method: 'GET',
    });
    return response.json();
}

export async function createIncome(token: string, request: CreateIncome): Promise<IncomeResponse> {
    const response = await apiFetch(`/income`, token, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
    });
    return response.json();
}

export async function updateIncome(token: string, id: string, request: UpdateIncome): Promise<IncomeResponse> {
    const response = await apiFetch(`/income/${id}`, token, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
    });
    return response.json();
}

export async function deleteIncome(token: string, id: string): Promise<IncomeResponse> {
    const response = await apiFetch(`/income/${id}`, token, {
        method: 'DELETE',
    });
    return response.json();
}

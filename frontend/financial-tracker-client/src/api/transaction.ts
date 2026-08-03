import { apiFetch } from "./client";

export type TransactionResponse = {
    id: string;
    user_id: string;
    category_id: string;
    amount: number;
    description: string;
    merchant: string;
    transaction_date: string;
}

export type CreateTransaction = {
    category_id: string;
    amount: number;
    description: string;
    merchant: string;
}

export type UpdateTransaction = {
    category_id: string;
    amount: number;
    description: string;
    merchant: string;
}

export async function getTransactions(token: string, category_id?: string): Promise<TransactionResponse[]> {
    const path = category_id
        ? `/transactions?category_id=${category_id}`
        : `/transactions`;
    const response = await apiFetch(path, token, {
        method: 'GET',
    });
    return response.json();
}

export async function getOneTransaction(token: string, id: string): Promise<TransactionResponse> {
    const response = await apiFetch(`/transactions/${id}`, token, {
        method: 'GET',
    });
    return response.json();
}

export async function getDeletedTransactions(token: string): Promise<TransactionResponse[]> {
    const response = await apiFetch(`/transactions/deleted`, token, {
        method: 'GET',
    });
    return response.json();
}

export async function createTransaction(token: string, request: CreateTransaction ): Promise<TransactionResponse> {
    const response = await apiFetch(`/transactions`, token, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request)
    });
    return response.json();
}

export async function updateTransaction(token: string, id: string, request: UpdateTransaction): Promise<TransactionResponse> {
    const response = await apiFetch(`/transactions/${id}`, token, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request)
    });
    return response.json();
}

export async function deleteTransaction(token: string, transaction_id: string): Promise<TransactionResponse> {
    const response = await apiFetch(`/transactions/${transaction_id}`, token, {
        method: 'DELETE',
    });
    return response.json();
}

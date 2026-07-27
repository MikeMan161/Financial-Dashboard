import type { Update } from "vite/types/hmrPayload.js";
import { API_URL } from "./config";
import type { MessageResponse } from "./types";

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
    const url = category_id
        ? `${API_URL}/transactions?category_id=${category_id}`
        : `${API_URL}/transactions`;
    const response = await fetch(url, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Could not get transactions")
    return response.json();
}

export async function getOneTransaction(token: string, id: string): Promise<TransactionResponse> {
    const response = await fetch(`${API_URL}/transactions/${id}`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Could not get transaction")
    return response.json();
}

export async function getDeletedTransactions(token: string): Promise<TransactionResponse[]> {
    const response = await fetch(`${API_URL}/transactions/deleted`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Could not get deleted transactions")
    return response.json();
}

export async function createTransaction(token: string, request: CreateTransaction ): Promise<TransactionResponse> {
    const response = await fetch(`${API_URL}/transactions`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request)
    });
    if (!response.ok) throw new Error("Could not create transaction")
    return response.json();
}

export async function updateTransaction(token: string, id: string, request: UpdateTransaction): Promise<TransactionResponse> {
    const response = await fetch(`${API_URL}/transactions/${id}`, {
        method: 'PATCH',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request)
    });
    if(!response.ok) throw new Error("Could not update transaction")
    return response.json();
}

export async function deleteTransaction(token: string, transaction_id: string): Promise<TransactionResponse> {
    const response = await fetch(`${API_URL}/transactions/${transaction_id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
    });
    if(!response.ok) throw new Error("Could not delete transaction")
    return response.json();
}
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

// Matches TransactionCreate on the backend, which only requires amount. The other
// four are nullable there, so they are nullable here — a blank merchant is absent,
// not an empty string.
//
// amount travels as a string on purpose. The column is Numeric and the schema is
// Decimal, and a JSON number would round-trip through a float on the way. Sending
// the digits the user typed hands Pydantic exactly those digits.
export type CreateTransaction = {
    category_id: string | null;
    amount: string;
    description: string | null;
    merchant: string | null;
    transaction_date: string;
}

export type UpdateTransaction = {
    category_id: string;
    amount: number;
    description: string;
    merchant: string;
}

// Both filters are optional and independent: no filter returns every transaction,
// bucket_id scopes to one envelope, category_id to a single category within one.
export type TransactionFilters = {
    category_id?: string;
    bucket_id?: string;
}

export async function getTransactions(token: string, filters: TransactionFilters = {}): Promise<TransactionResponse[]> {
    const params = new URLSearchParams();
    if (filters.category_id) params.set("category_id", filters.category_id);
    if (filters.bucket_id) params.set("bucket_id", filters.bucket_id);

    const query = params.toString();
    const path = query ? `/transactions?${query}` : `/transactions`;
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

import { apiFetch } from "./client";

export type SavingsGoalResponse = {
    id: string;
    user_id: string;
    bucket_id: string;
    name: string;
    description: string | null;
    target_amount: number;
    current_amount: number;
    due_date: string | null;
}

export type CreateSavingsGoal = {
    bucket_id: string;
    name: string;
    description?: string | null;
    target_amount: number;
    current_amount?: number;
    due_date?: string | null;
}

export type UpdateSavingsGoal = {
    bucket_id: string;
    name: string;
    description?: string | null;
    target_amount: number;
    current_amount?: number;
    due_date?: string | null;
}

export async function getSavingsGoals(token: string, bucket_id?: string): Promise<SavingsGoalResponse[]> {
    const path = bucket_id
        ? `/savings-goals?bucket_id=${bucket_id}`
        : `/savings-goals`;
    const response = await apiFetch(path, token, {
        method: 'GET',
    });
    return response.json();
}

export async function getOneSavingsGoal(token: string, id: string): Promise<SavingsGoalResponse> {
    const response = await apiFetch(`/savings-goals/${id}`, token, {
        method: 'GET',
    });
    return response.json();
}

export async function getDeletedSavingsGoals(token: string): Promise<SavingsGoalResponse[]> {
    const response = await apiFetch(`/savings-goals/deleted`, token, {
        method: 'GET',
    });
    return response.json();
}

export async function createSavingsGoal(token: string, request: CreateSavingsGoal): Promise<SavingsGoalResponse> {
    const response = await apiFetch(`/savings-goals`, token, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
    });
    return response.json();
}

export async function updateSavingsGoal(token: string, id: string, request: UpdateSavingsGoal): Promise<SavingsGoalResponse> {
    const response = await apiFetch(`/savings-goals/${id}`, token, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
    });
    return response.json();
}

export async function deleteSavingsGoal(token: string, id: string): Promise<SavingsGoalResponse> {
    const response = await apiFetch(`/savings-goals/${id}`, token, {
        method: 'DELETE',
    });
    return response.json();
}

import { API_URL } from "./config";

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
    const url = bucket_id
        ? `${API_URL}/savings-goals?bucket_id=${bucket_id}`
        : `${API_URL}/savings-goals`;
    const response = await fetch(url, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Could not get savings goals")
    return response.json();
}

export async function getOneSavingsGoal(token: string, id: string): Promise<SavingsGoalResponse> {
    const response = await fetch(`${API_URL}/savings-goals/${id}`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Could not get savings goal")
    return response.json();
}

export async function getDeletedSavingsGoals(token: string): Promise<SavingsGoalResponse[]> {
    const response = await fetch(`${API_URL}/savings-goals/deleted`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Could not get deleted savings goals")
    return response.json();
}

export async function createSavingsGoal(token: string, request: CreateSavingsGoal): Promise<SavingsGoalResponse> {
    const response = await fetch(`${API_URL}/savings-goals`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
    });
    if (!response.ok) throw new Error("Could not create savings goal")
    return response.json();
}

export async function updateSavingsGoal(token: string, id: string, request: UpdateSavingsGoal): Promise<SavingsGoalResponse> {
    const response = await fetch(`${API_URL}/savings-goals/${id}`, {
        method: 'PATCH',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
    });
    if (!response.ok) throw new Error("Could not update savings goal")
    return response.json();
}

export async function deleteSavingsGoal(token: string, id: string): Promise<SavingsGoalResponse> {
    const response = await fetch(`${API_URL}/savings-goals/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Could not delete savings goal")
    return response.json();
}

import { API_URL } from "./config";
import type { MessageResponse } from "./types";
export type CategoryResponse = {
    id: string;
    user_id: string;
    bucket_id: string;
    name: string;
}

export type CreateCategory = {
    bucket_id: string;
    name: string;
}

export type UpdateCategory = {
    bucket_id: string;
    name: string;
}

export async function getCategories(token:string, bucket_id:string): Promise<CategoryResponse[]> {
    const response = await fetch(`${API_URL}/categories?bucket_id=${bucket_id}`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Could not fetch categories");
    return response.json();
}

export async function getOneCategory(token:string, id:string): Promise<CategoryResponse> {
    const response = await fetch(`${API_URL}/categories/${id}`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Could not fetch category");
    return response.json();
}

export async function createCategory(token:string, request: CreateCategory): Promise<CategoryResponse> {
    const response = await fetch(`${API_URL}/categories`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': `application/json`,
        },
        body: JSON.stringify(request),
    });
    if (!response.ok) throw new Error("Could not create new category");
    return response.json();
}

export async function updateCategory(token:string, id:string, request:UpdateCategory ): Promise<CategoryResponse> {
    const response = await fetch(`${API_URL}/categories/${id}`, {
        method: 'PATCH',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': `application/json`,
        },
        body: JSON.stringify(request),
    });
    if (!response.ok) throw new Error("Could not update category");
    return response.json();
}

export async function deleteCategory(token:string, id:string): Promise<MessageResponse> {
    const response = await fetch(`${API_URL}/categories/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Could not delete category");
    return response.json();
}
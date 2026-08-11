import { apiFetch } from "./client";
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

// bucket_id is optional to match the backend, which returns every category when
// the filter is absent. The transactions page needs the unscoped list so it can
// group categories under their buckets in one request instead of one per bucket.
export async function getCategories(token:string, bucket_id?:string): Promise<CategoryResponse[]> {
    const path = bucket_id
        ? `/categories?bucket_id=${bucket_id}`
        : `/categories`;
    const response = await apiFetch(path, token, {
        method: 'GET',
    });
    return response.json();
}

export async function getOneCategory(token:string, id:string): Promise<CategoryResponse> {
    const response = await apiFetch(`/categories/${id}`, token, {
        method: 'GET',
    });
    return response.json();
}

export async function createCategory(token:string, request: CreateCategory): Promise<CategoryResponse> {
    const response = await apiFetch(`/categories`, token, {
        method: 'POST',
        headers: { 'Content-Type': `application/json` },
        body: JSON.stringify(request),
    });
    return response.json();
}

export async function updateCategory(token:string, id:string, request:UpdateCategory ): Promise<CategoryResponse> {
    const response = await apiFetch(`/categories/${id}`, token, {
        method: 'PATCH',
        headers: { 'Content-Type': `application/json` },
        body: JSON.stringify(request),
    });
    return response.json();
}

export async function deleteCategory(token:string, id:string): Promise<MessageResponse> {
    const response = await apiFetch(`/categories/${id}`, token, {
        method: 'DELETE',
    });
    return response.json();
}

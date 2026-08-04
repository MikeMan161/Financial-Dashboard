import { apiFetch } from "./client"
import type { MessageResponse } from "./types"

export type BucketResponse = {
  id: string
  user_id: string
  name: string
  bucket_type: string
  target_percentage: number
  alert_threshold: number
  limit: number
  spent: number
}

export type BucketCreate = {
  name: string;
  bucket_type: string;
  target_percentage: number;
  alert_threshold: number;
}

export async function getBuckets(token: string): Promise<BucketResponse[]> {
  const response = await apiFetch("/buckets", token)
  return response.json();
}

export async function getOneBucket(token: string, id: string): Promise<BucketResponse> {
  const response = await apiFetch(`/buckets/${id}`, token, {
    method: 'GET',
  });
  return response.json();
}

export async function createBucket(token: string, request: BucketCreate): Promise<BucketResponse> {
  const response = await apiFetch("/buckets", token, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request)
  });
  return response.json();
}

export async function updateBucket(token: string, id: string, request: BucketCreate): Promise<BucketResponse> {
  const response = await apiFetch(`/buckets/${id}`, token, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request)
  });
  return response.json();
}

export async function deleteBucket(token: string, id: string): Promise<MessageResponse> {
  const response = await apiFetch(`/buckets/${id}`, token, {
    method: 'DELETE',
  });
  return response.json();
}

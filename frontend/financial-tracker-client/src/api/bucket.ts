import { API_URL } from "./config"
import type { MessageResponse } from "./types"

export type BucketResponse = {
  id: string
  user_id: string
  name: string
  bucket_type: string
  target_percentage: number
  alert_threshold: number
}

export type BucketCreate = {
  name: string;
  bucket_type: string;
  target_percentage: number;
  alert_threshold: number;
}

export async function getBuckets(token: string): Promise<BucketResponse[]> {
  const response = await fetch(`${API_URL}/buckets`, {
    headers: { authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Failed to fetch buckets");
  return response.json();
}

export async function getOneBucket(token: string, id: string): Promise<BucketResponse> {
  const response = await fetch(`${API_URL}/buckets/${id}`, {
    method: 'GET',
    headers: {Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Could not fetch bucket")
  return response.json();
}

export async function createBucket(token: string, request: BucketCreate): Promise<BucketResponse> {
  const response = await fetch (`${API_URL}/buckets`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request)
  });
  if (!response.ok) throw new Error("Could not create bucket")
  return response.json();
}

export async function updateBucket(token: string, id: string, request: BucketCreate): Promise<BucketResponse> {
  const response = await fetch(`${API_URL}/buckets/${id}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request)
  });
  if (!response.ok) throw new Error("Could not update bucket")
  return response.json();
}

export async function deleteBucket(token: string, id: string): Promise<MessageResponse> {
  const response = await fetch(`${API_URL}/buckets/${id}`, {
    method: 'DELETE',
    headers: {Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Could not delete bucket")
  return response.json();
}
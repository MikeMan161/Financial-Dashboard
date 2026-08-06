import { apiFetch } from "./client"

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

// Mirrors the backend BucketUpdate schema: name and bucket_type are intentionally
// absent because the four seeded envelopes are fixed for the life of the account.
export type BucketUpdate = {
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

export async function updateBucket(token: string, id: string, request: BucketUpdate): Promise<BucketResponse> {
  const response = await apiFetch(`/buckets/${id}`, token, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request)
  });
  return response.json();
}

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

// Mirrors the backend BucketAllocation schema: name and bucket_type are intentionally
// absent because the four seeded envelopes are fixed for the life of the account.
export type BucketAllocation = {
  id: string;
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

// Sends the whole plan in one request. The backend commits all four buckets in a single
// transaction, so a rejected plan changes nothing server-side, and the response already
// carries the recomputed spent/limit figures — no follow-up getBuckets needed.
export async function updateBuckets(token: string, buckets: BucketAllocation[]): Promise<BucketResponse[]> {
  const response = await apiFetch("/buckets", token, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ buckets })
  });
  return response.json();
}

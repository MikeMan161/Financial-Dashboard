import { API_URL } from "./config"

export type BucketResponse = {
  id: string
  user_id: string
  name: string
  bucket_type: string
  target_percentage: number
  alert_threshold: number
}

export async function getBuckets(token: string): Promise<BucketResponse[]> {
  const response = await fetch(`${API_URL}/buckets`, {
    headers: { authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Failed to fetch buckets");
  return response.json();
}
import { useState, useEffect } from 'react'
import { Navigate, useNavigate } from 'react-router'
import { BucketCard } from '@/components/Bucket';
import type { BucketResponse } from '@/api/bucket';
import { getBuckets } from '@/api/bucket';
import { AuthError } from '@/api/client';



type DashboardProps = {
    token: string | null;
    clearToken: () => void
}
export default function Dashboard({ token, clearToken }: DashboardProps) {
    const [bucketInfo, setBucketInfo] = useState<BucketResponse[] | null>(null)
    const navigate = useNavigate()

    useEffect(() => {
      async function loadBuckets() {
        if (!token) return;
        try {
          const data = await getBuckets(token);
          setBucketInfo(data)
        } catch (err) {
          if (err instanceof AuthError) {
            clearToken()
            navigate("/")
          } else {
            console.error(err);
          }
        }
      }
      loadBuckets();
    }, [token, clearToken, navigate])

    if (!token) return <Navigate to="/" replace />;

    return (
    <>
      {bucketInfo && bucketInfo.map((bucket) => (
        <BucketCard
          key={bucket.id}
          name={bucket.name}
          limit={500}
          spent={150}
        />
      ))}
    </>
  );
}

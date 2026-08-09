import { useState, useEffect } from 'react'
import { Navigate, useNavigate } from 'react-router'
import { BucketCard } from '@/components/Bucket';
import type { BucketResponse } from '@/api/bucket';
import { getBuckets } from '@/api/bucket';
import { AuthError } from '@/api/client';
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'



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
    <div className="p-8 flex flex-col gap-2 h-full">
      <div className="grid grid-cols-2">
        {bucketInfo && bucketInfo.map((bucket) => (
          <BucketCard
            key={bucket.id}
            name={bucket.name}
            limit={bucket.limit}
            spent={bucket.spent}
          />
        ))}
      </div>
      <div className="flex gap-2 mt-auto">
        <Input placeholder="Enter transaction" />
        <Button className="rounded-full">Send</Button>
      </div>
      <Button className="self-center" variant="secondary">Manual Entry</Button>
    </div>
  );
}

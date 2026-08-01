import { useState, useEffect } from 'react'
import { Navigate } from 'react-router'
import { BucketCard } from '@/components/Bucket';
import type { BucketResponse } from '@/api/bucket';
import { getBuckets } from '@/api/bucket';



type DashboardProps = {
    token: string | null;
}
export default function Dashboard({ token }: DashboardProps) {
    const [bucketInfo, setBucketInfo] = useState<BucketResponse[] | null>(null)
    
    useEffect(() => {
      async function loadBuckets() {
        if (!token) return;
        try {
          const data = await getBuckets(token);
          setBucketInfo(data)
        } catch (error) {
          console.error(error);
        }
      }
      loadBuckets();        
    }, [token])

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

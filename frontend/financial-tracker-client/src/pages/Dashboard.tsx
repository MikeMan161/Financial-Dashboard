import { useState, useEffect } from 'react'
import { Navigate, useNavigate } from 'react-router'
import { BucketCard } from '@/components/Bucket';
import type { BucketResponse } from '@/api/bucket';
import { getBuckets } from '@/api/bucket';
import type { CategoryResponse } from '@/api/category';
import { getCategories } from '@/api/category';
import { AuthError } from '@/api/client';
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import ManualEntryDialog from '@/components/ManualEntryDialog'
import type { TransactionDraft } from '@/lib/drafts'
import { emptyDraft } from '@/lib/drafts'



type DashboardProps = {
    token: string | null;
    clearToken: () => void
}
export default function Dashboard({ token, clearToken }: DashboardProps) {
    const [bucketInfo, setBucketInfo] = useState<BucketResponse[] | null>(null)
    const [categories, setCategories] = useState<CategoryResponse[]>([])
    const [entryOpen, setEntryOpen] = useState(false)
    const [entryRows, setEntryRows] = useState<TransactionDraft[]>([])
    // Bumped every time the dialog is opened, so React throws the old form
    // instance away and rebuilds it from entryRows instead of reusing stale state.
    const [draftKey, setDraftKey] = useState(0)
    // Bumped after a save so the bucket effect re-runs and the spent figures pick
    // up the transactions that just landed.
    const [refreshKey, setRefreshKey] = useState(0)
    const navigate = useNavigate()

    function openManualEntry(rows: TransactionDraft[]) {
        setEntryRows(rows)
        setDraftKey((previous) => previous + 1)
        setEntryOpen(true)
    }

    useEffect(() => {
      async function loadBuckets() {
        if (!token) return;
        try {
          // In parallel — neither depends on the other, and the dialog needs the
          // categories the moment it opens.
          const [buckets, categoryList] = await Promise.all([
            getBuckets(token),
            getCategories(token),
          ]);
          setBucketInfo(buckets)
          setCategories(categoryList)
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
    }, [token, clearToken, navigate, refreshKey])

    if (!token) return <Navigate to="/" replace />;

    return (
    <div className="p-8 flex flex-col gap-2 h-full">
      <div className="grid grid-cols-2">
        {bucketInfo && bucketInfo.map((bucket) => (
          <BucketCard
            key={bucket.id}
            id={bucket.id}
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
      <Button
        className="self-center"
        variant="secondary"
        onClick={() => openManualEntry([emptyDraft()])}
      >
        Manual Entry
      </Button>

      <ManualEntryDialog
        key={draftKey}
        open={entryOpen}
        onOpenChange={setEntryOpen}
        initialRows={entryRows}
        token={token}
        buckets={bucketInfo ?? []}
        categories={categories}
        onSaved={() => setRefreshKey((previous) => previous + 1)}
        onAuthError={() => { clearToken(); navigate("/") }}
      />
    </div>
  );
}

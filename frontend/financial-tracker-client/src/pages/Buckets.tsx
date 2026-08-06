import { useState, useEffect } from 'react'
import { Navigate, useNavigate } from 'react-router'
import type { BucketResponse } from '@/api/bucket'
import { getBuckets, updateBucket } from '@/api/bucket'
import { AuthError } from '@/api/client'

type BucketsProps = {
    token: string | null;
    clearToken: () => void;
}

// The four envelopes are seeded at registration and cannot be added to or removed,
// so this page is edit-only: percentages and alert thresholds, nothing else.
export default function Buckets({ token, clearToken }: BucketsProps) {
    const [buckets, setBuckets] = useState<BucketResponse[] | null>(null)
    const [error, setError] = useState("")
    const [notice, setNotice] = useState("")
    const [saving, setSaving] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        async function loadBuckets() {
            if (!token) return
            try {
                setBuckets(await getBuckets(token))
            } catch (err) {
                if (err instanceof AuthError) {
                    clearToken()
                    navigate("/")
                } else {
                    console.error(err)
                    setError("Could not load your buckets")
                }
            }
        }
        loadBuckets()
    }, [token, clearToken, navigate])

    if (!token) return <Navigate to="/" replace />
    if (!buckets) return <p>Loading...</p>

    // Edits are held locally until save so the user can move percentages between
    // buckets without each intermediate step hitting the API.
    function editBucket(id: string, field: "target_percentage" | "alert_threshold", value: number) {
        setBuckets(prev =>
            prev && prev.map(bucket =>
                bucket.id === id ? { ...bucket, [field]: value } : bucket
            )
        )
        setNotice("")
    }

    async function handleSave(e: React.FormEvent) {
        e.preventDefault()
        if (!token || !buckets) return
        setError("")
        setNotice("")
        setSaving(true)
        try {
            for (const bucket of buckets) {
                await updateBucket(token, bucket.id, {
                    target_percentage: bucket.target_percentage,
                    alert_threshold: bucket.alert_threshold,
                })
            }
            // Refetch so spent/limit reflect the new percentages.
            setBuckets(await getBuckets(token))
            setNotice("Saved")
        } catch (err) {
            if (err instanceof AuthError) {
                clearToken()
                navigate("/")
            } else {
                console.error(err)
                setError(err instanceof Error ? err.message : "Could not save your changes")
            }
        } finally {
            setSaving(false)
        }
    }

    const total = Math.round(
        buckets.reduce((sum, bucket) => sum + Number(bucket.target_percentage), 0) * 100
    ) / 100

    // Over- and under-allocation are both allowed. We tell the user where they stand
    // and let them decide, rather than blocking the save or rebalancing for them.
    const planMessage =
        total > 100 ? `Your plan: ${total}% - you've allocated more than you earn. Trimming ${Math.round((total - 100) * 100) / 100}% somewhere will balance it.`
        : total < 100 ? `Your plan: ${total}% - ${Math.round((100 - total) * 100) / 100}% of your income isn't assigned yet. Worth giving it a job.`
        : `Your plan: 100% - every dollar has a job.`

    return (
        <>
            <h1 className="text-2xl font-bold text-center mt-10">Your Buckets</h1>
            <p>{planMessage}</p>
            {error && <p className="text-red-600">{error}</p>}
            {notice && <p>{notice}</p>}
            <form onSubmit={handleSave}>
                {buckets.map(bucket => (
                    <fieldset key={bucket.id}>
                        <legend>{bucket.name}</legend>
                        <label htmlFor={`target-${bucket.id}`}>Target percentage:</label>
                        <input
                            id={`target-${bucket.id}`}
                            type="number"
                            min="0"
                            max="100"
                            step="0.01"
                            value={bucket.target_percentage}
                            onChange={(e) => editBucket(bucket.id, "target_percentage", Number(e.target.value))}
                        />
                        <label htmlFor={`alert-${bucket.id}`}>Alert threshold:</label>
                        <input
                            id={`alert-${bucket.id}`}
                            type="number"
                            min="0"
                            max="100"
                            step="0.01"
                            value={bucket.alert_threshold}
                            onChange={(e) => editBucket(bucket.id, "alert_threshold", Number(e.target.value))}
                        />
                    </fieldset>
                ))}
                <button type="submit" disabled={saving}>{saving ? "Saving..." : "Save"}</button>
            </form>
        </>
    )
}

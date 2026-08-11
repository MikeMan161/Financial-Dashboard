import { useEffect, useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { BucketResponse } from '@/api/bucket'
import type { CategoryResponse } from '@/api/category'

type CategoryPanelProps = {
    buckets: BucketResponse[]
    categories: CategoryResponse[]
    selectedCategoryId: string | null
    onSelect: (categoryId: string | null) => void
}

export default function CategoryPanel({
    buckets,
    categories,
    selectedCategoryId,
    onSelect,
}: CategoryPanelProps) {
    const [openBuckets, setOpenBuckets] = useState<Set<string>>(new Set())

    // Reseeds whenever the visible buckets change, which includes navigating
    // between the scoped and unscoped routes. A lone bucket starts open, since
    // a single collapsed row is just an extra click to see the only thing there.
    useEffect(() => {
        setOpenBuckets(buckets.length === 1 ? new Set(buckets.map((b) => b.id)) : new Set())
    }, [buckets])

    function toggleBucket(bucketId: string) {
        setOpenBuckets((previous) => {
            const next = new Set(previous)
            if (next.has(bucketId)) {
                next.delete(bucketId)
            } else {
                next.add(bucketId)
            }
            return next
        })
    }

    return (
        <Card className="h-full">
            <CardContent className="flex flex-col gap-2">
                {/* Clearing the selection falls back to whatever the route already
                    scopes to — every transaction, or one bucket's worth. */}
                <Button
                    variant={selectedCategoryId === null ? "secondary" : "ghost"}
                    className="justify-start"
                    onClick={() => onSelect(null)}
                >
                    All transactions
                </Button>

                {buckets.map((bucket) => {
                    const owned = categories.filter((c) => c.bucket_id === bucket.id)
                    if (owned.length === 0) return null

                    const isOpen = openBuckets.has(bucket.id)

                    return (
                        <div key={bucket.id} className="flex flex-col">
                            <button
                                type="button"
                                onClick={() => toggleBucket(bucket.id)}
                                aria-expanded={isOpen}
                                className="flex items-center gap-1 rounded-md px-2 py-1.5 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
                            >
                                <ChevronRight
                                    className={`size-4 shrink-0 transition-transform ${isOpen ? "rotate-90" : ""}`}
                                />
                                <span className="flex-1 text-left">{bucket.name}</span>
                                <span className="text-xs font-normal text-muted-foreground">
                                    {owned.length}
                                </span>
                            </button>

                            {isOpen && (
                                <div className="flex flex-col gap-1 pt-1 pl-4">
                                    {owned.map((category) => (
                                        <Button
                                            key={category.id}
                                            variant={selectedCategoryId === category.id ? "secondary" : "ghost"}
                                            className="justify-start font-normal"
                                            onClick={() => onSelect(category.id)}
                                        >
                                            {category.name}
                                        </Button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )
                })}
            </CardContent>
        </Card>
    )
}

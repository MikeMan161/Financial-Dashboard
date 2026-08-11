import type { BucketResponse } from '@/api/bucket'

type BucketAllocationDialProps = {
    buckets: BucketResponse[]
}

// Keyed on bucket_type, never on array position: the API is free to return the
// four envelopes in any order, and a segment must not change colour because of it.
const BUCKET_COLORS: Record<string, string> = {
    fixed_costs: "var(--bucket-fixed-costs)",
    investments: "var(--bucket-investments)",
    savings: "var(--bucket-savings)",
    guilt_free: "var(--bucket-guilt-free)",
}

const RADIUS = 42
const STROKE = 12
// pathLength=100 redefines the circle's length as 100 units, so every number
// below is read directly as a percentage — the same trick as the bucket gauges.
const TOTAL = 100
// ~2px of surface showing between neighbouring segments. Converted from pixels
// into pathLength units: 2px of a 2*pi*r circumference, expressed out of 100.
const GAP = (2 / (2 * Math.PI * RADIUS)) * TOTAL

function round(value: number) {
    return Math.round(value * 100) / 100
}

export default function BucketAllocationDial({ buckets }: BucketAllocationDialProps) {
    const total = round(
        buckets.reduce((sum, bucket) => sum + Number(bucket.target_percentage), 0)
    )
    const overflow = Math.max(round(total - 100), 0)
    const unassigned = Math.max(round(100 - total), 0)

    // Segments are laid end to end around a ring that always means 100% of
    // income. A segment that would cross the top of the ring is drawn up to the
    // boundary; whatever is left over is shown by the overflow arc instead.
    let cursor = 0
    const segments = buckets.map((bucket) => {
        const percentage = Number(bucket.target_percentage)
        const start = cursor
        cursor += percentage

        const drawn = Math.min(percentage, Math.max(100 - start, 0))
        return {
            id: bucket.id,
            name: bucket.name,
            percentage,
            start,
            drawn,
            color: BUCKET_COLORS[bucket.bucket_type] ?? "var(--chart-2)",
        }
    })

    return (
        <div className="flex flex-col items-center gap-6">
            <div className="relative w-full max-w-2xs">
                <svg viewBox="0 0 100 100" className="w-full -rotate-90">
                    {/* Unfilled track. Under-allocation needs no special case — the
                        segments simply stop early and the track shows through. */}
                    <circle
                        cx="50"
                        cy="50"
                        r={RADIUS}
                        fill="none"
                        strokeWidth={STROKE}
                        className="stroke-muted"
                    />

                    {segments.map((segment) =>
                        segment.drawn <= 0 ? null : (
                            <circle
                                key={segment.id}
                                cx="50"
                                cy="50"
                                r={RADIUS}
                                pathLength={TOTAL}
                                fill="none"
                                strokeWidth={STROKE}
                                stroke={segment.color}
                                // One dash as long as this segment, then a gap long
                                // enough to cover the rest of the ring. A negative
                                // offset slides the dash to where the segment starts.
                                strokeDasharray={`${Math.max(segment.drawn - GAP, 0.01)} ${TOTAL}`}
                                strokeDashoffset={-segment.start}
                                className="transition-all duration-300"
                            />
                        )
                    )}

                    {/* Over-allocation rides a thinner arc outside the ring, so the
                        ring stays a truthful "100% of income" and the excess reads
                        as spilling past it rather than silently rescaling. */}
                    {overflow > 0 && (
                        <circle
                            cx="50"
                            cy="50"
                            r={RADIUS + STROKE / 2 + 4}
                            pathLength={TOTAL}
                            fill="none"
                            strokeWidth={4}
                            strokeLinecap="round"
                            className="stroke-destructive transition-all duration-300"
                            strokeDasharray={`${Math.min(overflow, TOTAL)} ${TOTAL}`}
                        />
                    )}
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-3xl font-semibold ${overflow > 0 ? "text-destructive" : ""}`}>
                        {total}%
                    </span>
                    <span className="text-xs text-muted-foreground">allocated</span>
                </div>
            </div>

            {/* The legend is not optional decoration: two of the four hues sit under
                3:1 against the light card, so identity is carried by label + swatch
                together rather than by colour alone. */}
            <ul className="w-full space-y-1.5">
                {segments.map((segment) => (
                    <li key={segment.id} className="flex items-center gap-2 text-sm">
                        <span
                            aria-hidden="true"
                            className="size-2.5 shrink-0 rounded-full"
                            style={{ background: segment.color }}
                        />
                        <span className="flex-1 truncate">{segment.name}</span>
                        <span className="tabular-nums text-muted-foreground">
                            {round(segment.percentage)}%
                        </span>
                    </li>
                ))}

                {unassigned > 0 && (
                    <li className="flex items-center gap-2 text-sm">
                        <span aria-hidden="true" className="size-2.5 shrink-0 rounded-full bg-muted" />
                        <span className="flex-1 text-muted-foreground">Unassigned</span>
                        <span className="tabular-nums text-muted-foreground">{unassigned}%</span>
                    </li>
                )}

                {overflow > 0 && (
                    <li className="flex items-center gap-2 text-sm">
                        <span aria-hidden="true" className="size-2.5 shrink-0 rounded-full bg-destructive" />
                        <span className="flex-1 text-destructive">Over-allocated</span>
                        <span className="tabular-nums text-destructive">{overflow}%</span>
                    </li>
                )}
            </ul>
        </div>
    )
}

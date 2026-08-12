import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import type { TransactionDraft, RowErrors } from '@/lib/drafts'
import { emptyDraft, validateRow, hasErrors, draftToPayload } from '@/lib/drafts'
import type { BucketResponse } from '@/api/bucket'
import type { CategoryResponse } from '@/api/category'
import { createTransaction } from '@/api/transaction'
import { AuthError } from '@/api/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'

type ManualEntryDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    initialRows: TransactionDraft[]
    token: string
    // Both, rather than categories alone, because the options are grouped under
    // their bucket the same way CategoryPanel groups them.
    buckets: BucketResponse[]
    categories: CategoryResponse[]
    onSaved: () => void
    onAuthError: () => void
}

export default function ManualEntryDialog({
    open,
    onOpenChange,
    initialRows,
    token,
    buckets,
    categories,
    onSaved,
    onAuthError,
}: ManualEntryDialogProps) {
    // Seeded once, on mount. The parent remounts this with a fresh key when it
    // opens with different rows, so there is no prop-into-state effect here to
    // go stale.
    const [rows, setRows] = useState<TransactionDraft[]>(initialRows)
    // Keyed by row id rather than index, so removing a row takes its messages
    // with it instead of sliding them onto the next one.
    const [rowErrors, setRowErrors] = useState<Record<string, RowErrors>>({})
    const [isSaving, setIsSaving] = useState(false)
    const [status, setStatus] = useState<string | null>(null)

    function updateRow(id: string, field: keyof TransactionDraft, value: string) {
        setRows((previous) =>
            previous.map((row) => (row.id === id ? { ...row, [field]: value } : row))
        )

        // Only the field being edited gets its message cleared, so fixing the
        // amount doesn't quietly wipe the one still sitting on the date.
        setRowErrors((previous) => {
            const existing = previous[id]
            if (!existing) return previous
            const next = { ...existing }
            delete next[field as keyof RowErrors]
            return { ...previous, [id]: next }
        })
    }

    function addRow() {
        setRows((previous) => [...previous, emptyDraft()])
    }

    function removeRow(id: string) {
        setRows((previous) => previous.filter((row) => row.id !== id))
        setRowErrors((previous) => {
            const next = { ...previous }
            delete next[id]
            return next
        })
    }

    async function handleSave() {
        const found: Record<string, RowErrors> = {}
        for (const row of rows) {
            const errors = validateRow(row)
            if (hasErrors(errors)) found[row.id] = errors
        }

        setRowErrors(found)
        if (Object.keys(found).length > 0) {
            setStatus(null)
            return
        }

        setIsSaving(true)
        setStatus(null)

        // One POST per row — there is no bulk endpoint — which means there is no
        // transaction around the batch either. If row three fails, rows one and two
        // are already saved and cannot be taken back, so the failures stay in the
        // form and the successes leave it. Retrying re-sends only what didn't land.
        const failed: TransactionDraft[] = []
        let saved = 0

        for (const row of rows) {
            try {
                await createTransaction(token, draftToPayload(row))
                saved += 1
            } catch (err) {
                if (err instanceof AuthError) {
                    setIsSaving(false)
                    onAuthError()
                    return
                }
                console.error(err)
                failed.push(row)
            }
        }

        setIsSaving(false)

        if (saved > 0) onSaved()

        if (failed.length === 0) {
            onOpenChange(false)
            return
        }

        setRows(failed)
        setStatus(
            saved === 0
                ? "That didn't go through. Check your connection and try again."
                : `Saved ${saved} of ${saved + failed.length}. The rest are still here — try again.`
        )
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Manual entry</DialogTitle>
                    <DialogDescription>
                        Record a transaction. Add a row for each one.
                    </DialogDescription>
                </DialogHeader>

                {/* gap-4 between rows, gap-2 within one, so a row reads as a single
                    unit once there are several stacked up. */}
                <div className="flex max-h-[70vh] flex-col gap-4 overflow-y-auto">
                    {rows.map((row) => {
                        const errors = rowErrors[row.id] ?? {}
                        const messages = [errors.amount, errors.transaction_date].filter(Boolean)

                        return (
                        <div key={row.id} className="flex flex-col gap-2">
                            <div className="grid grid-cols-[6.5rem_1fr_1fr] gap-2">
                                <Input
                                    placeholder="0.00"
                                    inputMode="decimal"
                                    aria-label="Amount"
                                    aria-invalid={errors.amount !== undefined}
                                    value={row.amount}
                                    onChange={(e) => updateRow(row.id, "amount", e.target.value)}
                                />
                                <Input
                                    placeholder="Description"
                                    aria-label="Description"
                                    value={row.description}
                                    onChange={(e) =>
                                        updateRow(row.id, "description", e.target.value)
                                    }
                                />
                                <Input
                                    placeholder="Merchant"
                                    aria-label="Merchant"
                                    value={row.merchant}
                                    onChange={(e) => updateRow(row.id, "merchant", e.target.value)}
                                />
                            </div>
                            <div className="grid grid-cols-[1fr_9rem_2.25rem] gap-2">
                                {/* Native select on purpose: there is no ui/select.tsx yet. */}
                                <select
                                    aria-label="Category"
                                    value={row.category_id ?? ""}
                                    onChange={(e) =>
                                        updateRow(row.id, "category_id", e.target.value)
                                    }
                                    className="h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-2.5 py-1 text-base shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm dark:bg-input/30"
                                >
                                    {/* Stays selectable: leaving a row uncategorized is a
                                        legitimate answer, not a placeholder to replace. */}
                                    <option value="">Uncategorized</option>
                                    {buckets.map((bucket) => {
                                        const owned = categories.filter(
                                            (category) => category.bucket_id === bucket.id
                                        )
                                        if (owned.length === 0) return null

                                        return (
                                            <optgroup key={bucket.id} label={bucket.name}>
                                                {owned.map((category) => (
                                                    <option key={category.id} value={category.id}>
                                                        {category.name}
                                                    </option>
                                                ))}
                                            </optgroup>
                                        )
                                    })}
                                </select>
                                <Input
                                    type="date"
                                    aria-label="Date"
                                    aria-invalid={errors.transaction_date !== undefined}
                                    value={row.transaction_date}
                                    onChange={(e) =>
                                        updateRow(row.id, "transaction_date", e.target.value)
                                    }
                                />
                                {/* Held back on a lone row: emptying the form entirely
                                    leaves nothing to type into and no way back. */}
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    aria-label="Remove row"
                                    disabled={rows.length === 1 || isSaving}
                                    onClick={() => removeRow(row.id)}
                                >
                                    <Trash2 />
                                </Button>
                            </div>

                            {messages.map((message) => (
                                <p key={message} className="text-xs text-destructive">
                                    {message}
                                </p>
                            ))}
                        </div>
                        )
                    })}
                </div>

                <div className="flex items-center justify-between gap-2">
                    <Button variant="ghost" onClick={addRow} disabled={isSaving}>
                        Add another
                    </Button>
                    {status && (
                        <p className="text-xs text-muted-foreground">{status}</p>
                    )}
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isSaving}
                    >
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={isSaving}>
                        {isSaving ? "Saving…" : "Save"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

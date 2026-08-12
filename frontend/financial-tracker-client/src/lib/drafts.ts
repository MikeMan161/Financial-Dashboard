/**
 * The draft a transaction is while it is still in the form, and the four
 * conversions around it. This lives outside the dialog because the AI layer
 * writes the same shape the form does — one type, one validator, one payload
 * conversion, whichever way the row got there.
 */
import type { ParsedTransaction } from '@/api/ai'
import type { CreateTransaction } from '@/api/transaction'

// What the form holds, and what the AI parser returns. Every field is a string
// because that is what an input gives back — parsing and validation happen once,
// at the submit boundary, not while typing.
export type TransactionDraft = {
    id: string                  // row key on the client only, never the DB id
    amount: string
    description: string
    merchant: string
    category_id: string | null
    transaction_date: string    // YYYY-MM-DD
}

// Local date, not UTC. toISOString() would hand back yesterday for anyone
// west of Greenwich after their evening rolls past midnight UTC.
export function today(): string {
    const now = new Date()
    const month = String(now.getMonth() + 1).padStart(2, "0")
    const day = String(now.getDate()).padStart(2, "0")
    return `${now.getFullYear()}-${month}-${day}`
}

// crypto.randomUUID() only exists in a secure context — HTTPS or localhost — so
// it is there in dev and may not be once this is deployed. These ids are React
// list keys that never leave the browser, so a counter is a fine substitute.
let rowCounter = 0

function rowId(): string {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
        return crypto.randomUUID()
    }
    rowCounter += 1
    return `row-${Date.now()}-${rowCounter}`
}

export function emptyDraft(): TransactionDraft {
    return {
        id: rowId(),
        amount: "",
        description: "",
        merchant: "",
        category_id: null,
        transaction_date: today(),
    }
}

// The parser leaves out whatever it wasn't sure about, and a null handed to a
// controlled input makes React switch that input to uncontrolled mid-render. Every
// blank turns into "" here, at the one place drafts get made. category_id keeps
// its null because the draft type allows it and the select reads it as "".
export function draftFromParsed(parsed: ParsedTransaction): TransactionDraft {
    return {
        id: rowId(),
        amount: parsed.amount ?? "",
        description: parsed.description ?? "",
        merchant: parsed.merchant ?? "",
        category_id: parsed.category_id,
        transaction_date: parsed.transaction_date ?? today(),
    }
}

// Only the two fields that can actually stop a save. Everything else on a row is
// nullable at the database, so a blank one is a blank, not a mistake.
export type RowErrors = {
    amount?: string
    transaction_date?: string
}

// Coach, not judge: each message says what to do next rather than what went wrong.
export function validateRow(row: TransactionDraft): RowErrors {
    const errors: RowErrors = {}
    const amount = row.amount.trim()

    if (amount === "") {
        errors.amount = "Add an amount."
    } else if (!Number.isFinite(Number(amount))) {
        // Number("") is 0, which is why the blank case is handled first.
        errors.amount = "Amounts look like 12.50."
    } else if (Number(amount) <= 0) {
        errors.amount = "Amounts are positive — 12.50, not -12.50."
    }

    if (row.transaction_date.trim() === "") {
        errors.transaction_date = "Pick a date."
    }

    return errors
}

export function hasErrors(errors: RowErrors): boolean {
    return Object.keys(errors).length > 0
}

// Two empty-string traps live here and TypeScript catches neither, because "" is a
// perfectly good string: the select writes "" the moment it is touched, and an
// untouched merchant is already "". Sent as-is, the first is a 422 ("" is not a
// UUID) and the second stores a blank merchant instead of no merchant.
export function draftToPayload(draft: TransactionDraft): CreateTransaction {
    return {
        amount: draft.amount.trim(),
        description: draft.description.trim() || null,
        merchant: draft.merchant.trim() || null,
        category_id: draft.category_id || null,
        transaction_date: draft.transaction_date,
    }
}

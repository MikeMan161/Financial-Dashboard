// Amounts arrive from the API as strings, because the backend columns are
// Numeric and JSON has no decimal type. Every display path goes through here so
// the Number() coercion happens in exactly one place.
export function formatMoney(value: number | string) {
    return `$${Number(value).toFixed(2)}`
}

// Compact form for axis ticks and tight labels: $1.2k instead of $1200.00.
export function formatMoneyShort(value: number | string) {
    const amount = Number(value)
    if (Math.abs(amount) >= 1000) {
        return `$${(amount / 1000).toFixed(1)}k`
    }
    return `$${amount.toFixed(0)}`
}

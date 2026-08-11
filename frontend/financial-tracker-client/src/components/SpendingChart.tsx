import { useMemo } from 'react'
import {
    Bar,
    BarChart,
    LabelList,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { TransactionResponse } from '@/api/transaction'
import { formatMoney } from '@/lib/format'

type SpendingChartProps = {
    transactions: TransactionResponse[] | null
    categoryNames: Map<string, string>
    selectedCategoryId: string | null
}

function ChartShell({ children }: { children: React.ReactNode }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base font-medium">Spending by category</CardTitle>
            </CardHeader>
            <CardContent>{children}</CardContent>
        </Card>
    )
}

export default function SpendingChart({
    transactions,
    categoryNames,
    selectedCategoryId,
}: SpendingChartProps) {
    // One row per category, largest first. Sorting is the whole point of the
    // chart — "what is eating this envelope" is a ranking question.
    const data = useMemo(() => {
        if (transactions === null) return []

        const totals = new Map<string, number>()
        for (const transaction of transactions) {
            const key = transaction.category_id ?? "uncategorized"
            totals.set(key, (totals.get(key) ?? 0) + Number(transaction.amount))
        }

        return [...totals.entries()]
            .map(([categoryId, total]) => ({
                categoryId,
                name: categoryNames.get(categoryId) ?? "Uncategorized",
                total,
                // Emphasis rather than recolouring: selecting a category dims its
                // siblings instead of reassigning hues, so a bar never changes
                // colour based on what else happens to be on screen. Recharts
                // reads `fill` off the datum, which replaces the deprecated <Cell>.
                fill:
                    selectedCategoryId === null || selectedCategoryId === categoryId
                        ? "var(--chart-2)"
                        : "color-mix(in oklab, var(--chart-2) 30%, transparent)",
            }))
            .sort((a, b) => b.total - a.total)
    }, [transactions, categoryNames, selectedCategoryId])

    if (transactions === null) {
        return (
            <ChartShell>
                <div className="py-10 text-center text-sm text-muted-foreground">
                    Loading spending...
                </div>
            </ChartShell>
        )
    }

    if (data.length === 0) {
        return (
            <ChartShell>
                <div className="py-10 text-center text-sm text-muted-foreground">
                    Nothing spent here yet.
                </div>
            </ChartShell>
        )
    }

    // Height grows with the rows instead of being fixed, so bars never compress
    // into each other and the card never gets an inner scrollbar.
    const chartHeight = Math.max(140, data.length * 44)

    return (
        <ChartShell>
            <ResponsiveContainer width="100%" height={chartHeight}>
                <BarChart
                    data={data}
                    layout="vertical"
                    margin={{ top: 4, right: 64, bottom: 4, left: 4 }}
                >
                    {/* Hidden: the value labels at each bar tip carry the numbers, so
                        an axis and gridlines would be redundant ink. */}
                    <XAxis type="number" hide />
                    <YAxis
                        type="category"
                        dataKey="name"
                        width={110}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                    />
                    <Tooltip
                        cursor={{ fill: "var(--accent)" }}
                        formatter={(value) => [formatMoney(Number(value)), "Spent"]}
                        contentStyle={{
                            background: "var(--popover)",
                            border: "1px solid var(--border)",
                            borderRadius: "0.5rem",
                            color: "var(--popover-foreground)",
                            fontSize: "0.8125rem",
                        }}
                    />
                    <Bar dataKey="total" barSize={20} radius={[0, 4, 4, 0]}>
                        <LabelList
                            dataKey="total"
                            position="right"
                            formatter={(label) => formatMoney(Number(label ?? 0))}
                            className="fill-muted-foreground"
                            fontSize={12}
                        />
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </ChartShell>
    )
}

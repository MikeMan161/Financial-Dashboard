import { useMemo } from 'react'
import { Bar, BarChart, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { DebtResponse } from '@/api/debt'
import { formatMoney } from '@/lib/format'

type DebtBalanceChartProps = {
    debts: DebtResponse[] | null
}

function Shell({ children }: { children: React.ReactNode }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base font-medium">Outstanding debts</CardTitle>
            </CardHeader>
            <CardContent>{children}</CardContent>
        </Card>
    )
}

export default function DebtBalanceChart({ debts }: DebtBalanceChartProps) {
    // No progress track here, unlike savings goals: DebtResponse has no original
    // balance, so how much has been paid off is not derivable. These are plain
    // magnitude bars — largest balance first, since that is the ranking question.
    const data = useMemo(() => {
        if (debts === null) return []

        return debts
            .map((debt) => ({
                id: debt.id,
                name: debt.name,
                balance: Number(debt.current_balance),
                apr: Number(debt.apr),
                minimum: Number(debt.minimum_payment),
            }))
            .sort((a, b) => b.balance - a.balance)
    }, [debts])

    if (debts === null) {
        return <Shell><div className="py-10 text-center text-sm text-muted-foreground">Loading debts...</div></Shell>
    }

    if (data.length === 0) {
        return <Shell><div className="py-10 text-center text-sm text-muted-foreground">No debts tracked. Nice.</div></Shell>
    }

    const chartHeight = Math.max(140, data.length * 44)

    return (
        <Shell>
            <ResponsiveContainer width="100%" height={chartHeight}>
                <BarChart data={data} layout="vertical" margin={{ top: 4, right: 72, bottom: 4, left: 4 }}>
                    <XAxis type="number" hide />
                    <YAxis
                        type="category"
                        dataKey="name"
                        width={100}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                    />
                    <Tooltip
                        cursor={{ fill: "var(--accent)" }}
                        formatter={(value, _name, item) => {
                            const row = item?.payload as (typeof data)[number] | undefined
                            return [
                                `${formatMoney(Number(value))} · ${row?.apr ?? 0}% APR · ${formatMoney(row?.minimum ?? 0)}/mo min`,
                                "Balance",
                            ]
                        }}
                        contentStyle={{
                            background: "var(--popover)",
                            border: "1px solid var(--border)",
                            borderRadius: "0.5rem",
                            color: "var(--popover-foreground)",
                            fontSize: "0.8125rem",
                        }}
                    />
                    <Bar dataKey="balance" barSize={20} radius={[0, 4, 4, 0]} fill="var(--chart-2)">
                        <LabelList
                            dataKey="balance"
                            position="right"
                            formatter={(label) => formatMoney(Number(label ?? 0))}
                            className="fill-muted-foreground"
                            fontSize={12}
                        />
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </Shell>
    )
}

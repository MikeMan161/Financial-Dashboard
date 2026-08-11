import { useMemo } from 'react'
import { Bar, BarChart, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { SavingsGoalResponse } from '@/api/savings-goal'
import { formatMoney } from '@/lib/format'

type GoalProgressChartProps = {
    goals: SavingsGoalResponse[] | null
}

function Shell({ children }: { children: React.ReactNode }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base font-medium">Savings goals</CardTitle>
            </CardHeader>
            <CardContent>{children}</CardContent>
        </Card>
    )
}

export default function GoalProgressChart({ goals }: GoalProgressChartProps) {
    // Two stacked segments per goal: what is saved, and what is still missing.
    // Stacking them means a bar's full length is that goal's target, so goals
    // stay comparable in absolute dollars rather than all filling the width.
    const data = useMemo(() => {
        if (goals === null) return []

        return goals.map((goal) => {
            const target = Number(goal.target_amount)
            const saved = Math.min(Number(goal.current_amount), target)

            return {
                id: goal.id,
                name: goal.name,
                saved,
                remaining: Math.max(target - saved, 0),
                target,
            }
        })
    }, [goals])

    if (goals === null) {
        return <Shell><div className="py-10 text-center text-sm text-muted-foreground">Loading goals...</div></Shell>
    }

    if (data.length === 0) {
        return <Shell><div className="py-10 text-center text-sm text-muted-foreground">No savings goals yet.</div></Shell>
    }

    const chartHeight = Math.max(140, data.length * 44)

    return (
        <Shell>
            <ResponsiveContainer width="100%" height={chartHeight}>
                <BarChart data={data} layout="vertical" margin={{ top: 4, right: 96, bottom: 4, left: 4 }}>
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
                        formatter={(value, name) => [
                            formatMoney(Number(value)),
                            name === "saved" ? "Saved" : "Remaining",
                        ]}
                        contentStyle={{
                            background: "var(--popover)",
                            border: "1px solid var(--border)",
                            borderRadius: "0.5rem",
                            color: "var(--popover-foreground)",
                            fontSize: "0.8125rem",
                        }}
                    />
                    {/* stackId joins the two into one bar. The 2px surface-coloured
                        stroke is the gap that separates the segments — a border
                        drawn around marks would add ink that isn't data. */}
                    <Bar
                        dataKey="saved"
                        stackId="goal"
                        barSize={20}
                        radius={[0, 4, 4, 0]}
                        fill="var(--chart-2)"
                        stroke="var(--card)"
                        strokeWidth={2}
                    />
                    <Bar
                        dataKey="remaining"
                        stackId="goal"
                        barSize={20}
                        radius={[0, 4, 4, 0]}
                        fill="color-mix(in oklab, var(--chart-2) 18%, transparent)"
                    >
                        {/* Labelled on the outer segment so the text lands past the
                            end of the whole bar, not in the middle of the stack. */}
                        <LabelList
                            position="right"
                            className="fill-muted-foreground"
                            fontSize={12}
                            content={({ x, y, width, height, index }) => {
                                const row = data[Number(index)]
                                if (!row) return null
                                return (
                                    <text
                                        x={Number(x) + Number(width) + 8}
                                        y={Number(y) + Number(height) / 2}
                                        dominantBaseline="middle"
                                        fontSize={12}
                                        className="fill-muted-foreground"
                                    >
                                        {`${formatMoney(row.saved)} / ${formatMoney(row.target)}`}
                                    </text>
                                )
                            }}
                        />
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </Shell>
    )
}

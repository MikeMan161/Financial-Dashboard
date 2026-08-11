import { Card, CardContent } from '@/components/ui/card'
import type { TransactionResponse } from '@/api/transaction'

type TransactionTableProps = {
    transactions: TransactionResponse[] | null
    categoryNames: Map<string, string>
}

function formatDate(value: string) {
    return new Date(value).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
    })
}

export default function TransactionTable({ transactions, categoryNames }: TransactionTableProps) {
    // null is "not loaded yet", an empty array is "loaded, nothing here" — two
    // different states that would otherwise both render as a blank table.
    if (transactions === null) {
        return (
            <Card>
                <CardContent className="py-10 text-center text-sm text-muted-foreground">
                    Loading transactions...
                </CardContent>
            </Card>
        )
    }

    if (transactions.length === 0) {
        return (
            <Card>
                <CardContent className="py-10 text-center text-sm text-muted-foreground">
                    No transactions here yet.
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardContent className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b text-left text-muted-foreground">
                            <th className="py-2 pr-4 font-medium">Date</th>
                            <th className="py-2 pr-4 font-medium">Merchant</th>
                            <th className="py-2 pr-4 font-medium">Description</th>
                            <th className="py-2 pr-4 font-medium">Category</th>
                            <th className="py-2 text-right font-medium">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((transaction) => (
                            <tr key={transaction.id} className="border-b last:border-0">
                                <td className="py-2 pr-4 whitespace-nowrap">
                                    {formatDate(transaction.transaction_date)}
                                </td>
                                <td className="py-2 pr-4">{transaction.merchant || "—"}</td>
                                <td className="py-2 pr-4 text-muted-foreground">
                                    {transaction.description || "—"}
                                </td>
                                <td className="py-2 pr-4">
                                    {categoryNames.get(transaction.category_id) ?? "Uncategorized"}
                                </td>
                                <td className="py-2 text-right tabular-nums">
                                    ${Number(transaction.amount).toFixed(2)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </CardContent>
        </Card>
    )
}

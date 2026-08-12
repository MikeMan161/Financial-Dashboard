import { apiFetch } from "./client"

export type ParseRequest = {
    text: string
    today: string
}

// Mirrors ParsedTransaction on the backend. Every field is nullable because the
// model is told to omit anything it isn't confident about rather than guess.
export type ParsedTransaction = {
    amount: string | null;
    description: string | null;
    merchant: string | null;
    category_id: string | null;
    transaction_date: string | null;
}

type ParseResponse = {
    transactions: ParsedTransaction[]
}

// today comes from the browser because the server's clock is UTC. Without it,
// "coffee today" typed at 8pm Eastern gets filed under tomorrow.
export async function parseTransaction(prompt: string, token: string, today: string): Promise<ParsedTransaction[]> {
    const response = await apiFetch('/ai/parse', token, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ text: prompt, today } satisfies ParseRequest)
    });
    const data: ParseResponse = await response.json()
    return data.transactions
}
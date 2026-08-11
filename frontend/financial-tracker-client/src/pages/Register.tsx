import { useState } from "react"
import { register, login } from "@/api/auth"
import { useNavigate } from "react-router"
import { Button } from "@/components/ui/button"
import AuthLayout from "@/components/AuthLayout"
import AuthField from "@/components/AuthField"

type RegistrationPageProps = {
    setToken: (token: string) => void;
}
export default function Register({ setToken }: RegistrationPageProps) {
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    //const [currency, setCurrency] = useState("")
    const [monthly_income, setMonthly_income] = useState("")
    const [error, setError] = useState("")
    const navigate = useNavigate()

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("")

        const income = Number(monthly_income)
        if (monthly_income.trim() === "" || Number.isNaN(income)) {
            setError("Monthly income must be a number")
            return
        }
        if (income < 0) {
            setError("Monthly income cannot be negative")
            return
        }
        if (username.length < 3) {
            setError("Username must be at least 3 characters long")
            return
        }
        if (password.length < 8) {
            setError("Password must be at least 8 characters long")
            return
        }
        try {
            await register({ username, email, password, monthly_income: income});
        } catch (err) {
            setError(err instanceof Error ? err.message : "Account creation failed")
            console.error(err)
            return
        }
        try {
            const newToken = await login(email, password)
            setToken(newToken)
            navigate("/Dashboard")
        } catch (err) {
            console.error(err)
            navigate("/Login", { state: { notice: "Account created - please log in."} })
        }
    }

    return (
        <AuthLayout
            title="Create account"
            switchPrompt="Already have an account?"
            switchLabel="Log in"
            switchTo="/Login"
        >
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <AuthField
                    id="username"
                    label="Username"
                    type="text"
                    value={username}
                    onChange={setUsername}
                    autoComplete="username"
                    narrow
                />
                <AuthField
                    id="email"
                    label="Email"
                    type="email"
                    value={email}
                    onChange={setEmail}
                    autoComplete="email"
                />
                <AuthField
                    id="password"
                    label="Password"
                    type="password"
                    value={password}
                    onChange={setPassword}
                    autoComplete="new-password"
                />
                <AuthField
                    id="monthly_income"
                    label="Average monthly income"
                    type="text"
                    value={monthly_income}
                    onChange={setMonthly_income}
                    narrow
                />

                {error && <p className="text-sm text-destructive">{error}</p>}

                <Button type="submit" className="mt-2 h-11 rounded-xl">
                    Create account
                </Button>
            </form>
        </AuthLayout>
    )
}

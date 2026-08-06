import { useState } from "react"
import { register, login } from "@/api/auth"
import { useNavigate } from "react-router"

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
        try {
            await register({ username, email, password, monthly_income: income});
            const newToken = await login(email, password)
            setToken(newToken);
            navigate("/Dashboard")
            console.log("Account Created!")
        } catch (error) {
            setError("Account creation failed")
            console.error(error)
        }
    }
    
    
    
    
    
    return (
        <>
            <h1 className="text-2xl font-bold text-center mt-10">Register:</h1>
            {error && <p className="text-red-600 text-center">{error}</p>}
            <form onSubmit={handleSubmit}>
                <label htmlFor="username">Enter Username:</label>
                <input id="username" type="text" value={username} name="username" onChange={(e) => setUsername(e.target.value)} />
                <label htmlFor="email">Enter Email:</label>
                <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <label htmlFor="password">Enter Password:</label>
                <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <label htmlFor="monthly_income">Enter average monthly income:</label>
                <input id="Monthly_income" type="text" value = {monthly_income} onChange={(e) => setMonthly_income(e.target.value)} />
                <button type="submit">Register</button>
            </form>
        </>
    )
}
import { useState } from 'react'
import { login } from '../api/auth'
import { useNavigate, useLocation } from "react-router"
import { Button } from "@/components/ui/button"
import AuthLayout from "@/components/AuthLayout"
import AuthField from "@/components/AuthField"

type LoginPageProps = {
    setToken: (token: string) => void;
}

function LoginPage({ setToken }: LoginPageProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate();
  const location = useLocation()
  const notice = (location.state as { notice?: string } | null)?.notice
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("")
    try {
      const newToken = await login(email, password);
      setToken(newToken);
      navigate("/Dashboard")
    } catch (err) {
      console.error("login failed:", err);
      setError(err instanceof Error ? err.message : "Incorrect credentials")
    }
  }

  return (
    <AuthLayout
      title="Welcome back"
      switchPrompt="New here?"
      switchLabel="Create an account"
      switchTo="/SignUp"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Carried over from Register's fallback when auto-login fails, so the
            "account created, please log in" message still lands here. */}
        {notice && <p className="text-sm text-primary">{notice}</p>}

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
          autoComplete="current-password"
        />

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button type="submit" className="mt-2 h-11 rounded-xl">
          Log in
        </Button>
      </form>
    </AuthLayout>
  );
}

export default LoginPage

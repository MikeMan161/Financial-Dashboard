import { useState } from 'react'
import { login } from '../api/auth'
import { useNavigate, useLocation } from "react-router"

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
      console.log("Token Recieved:", newToken);
    } catch (err) {
      console.error("login failed:", err);
      setError(err instanceof Error ? err.message : "Incorrect credentials")
    }
  }

  return (
    <>
      <h1 className="text-2xl font-bold text-center mt-10">Please login</h1>
      {notice && <p className="text-green-600 text-center">{notice}</p>}
      {error && <p className="text-red-600 text-center">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
        <button type="submit">Log in</button>
      </form>
    </>
  );
}

export default LoginPage
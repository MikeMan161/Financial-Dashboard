import { useState } from 'react'
import { login } from '../api/auth'
import { useNavigate } from "react-router"

type LoginPageProps = {
    setToken: (token: string) => void;
}

function LoginPage({ setToken }: LoginPageProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate();
  
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const newToken = await login(email, password);
      setToken(newToken);
      navigate("/dashboard")
      console.log("Token Recieved:", newToken);
    } catch (error) {
      console.error("login failed:", error);
    }
  }

  return (
    <>
      <h1>Please Login:</h1>
      <form onSubmit={handleSubmit}>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
        <button type="submit">Log in</button>
      </form>
    </>
  );
}

export default LoginPage
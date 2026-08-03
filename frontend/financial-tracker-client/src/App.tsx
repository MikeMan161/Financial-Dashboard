import { useState } from 'react'
import { Routes, Route } from 'react-router'
import LoginPage from './pages/Login'
import Dashboard from './pages/Dashboard'

export default function App() {
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem("token")
  )
  
  function saveToken(newToken: string) {
    localStorage.setItem("token", newToken)
    setToken(newToken)
  }

  function clearToken() {
    localStorage.removeItem("token")
    setToken(null)
  }
  return (
    <Routes>
      <Route path="/" element={<LoginPage setToken={saveToken} />} />
      <Route path="/Dashboard" element={<Dashboard token={token} clearToken={clearToken} />} />
    </Routes>
  );
}
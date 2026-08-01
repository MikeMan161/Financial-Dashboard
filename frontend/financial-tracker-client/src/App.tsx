import { useState } from 'react'
import { Routes, Route } from 'react-router'
import LoginPage from './pages/Login'
import Dashboard from './pages/Dashboard'

export default function App() {
  const [token, setToken] = useState<string | null>(null)
  return (
    <Routes>
      <Route path="/" element={<LoginPage setToken={setToken} />} />
      <Route path="/Dashboard" element={<Dashboard token={token} />} />
    </Routes>
  );
}
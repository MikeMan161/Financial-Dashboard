import { useState } from 'react'
import { Navigate } from 'react-router'

type DashboardProps = {
    token: string | null;
}
export default function Dashboard({ token }: DashboardProps) {
    if (!token) return <Navigate to="/" replace />;
  return (
    <>
      <h1>Hello, this is my finance tracker</h1>
      <ul>
        <li>Track your spending</li>
        <li>Create your guilt-free spending plan</li>
      </ul>
      
    </>
  );
}

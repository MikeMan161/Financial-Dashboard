import { useState } from 'react'

type DashboardProps = {
    token: string | null;
}
export default function Dashboard({ token }: DashboardProps) {
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

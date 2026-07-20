import { useState } from 'react'
import { login } from './api/auth'
import Bucket from './components/Bucket'
import Toolbar from './components/testing'

const buckets = [
  { name: "Fixed Costs", percent: 55 },
  { name: "Investments", percent: 10 },
  { name: "Savings", percent: 8 },
  { name: "Guilt-Free Spending", percent: 27 },
];

function App() {
  const [token, setToken] = useState<string | null>(null);

  async function handleLogin() {
    try {
      const newToken = await login("user@example.com", "string");
      setToken(newToken);
      console.log("Token Recieved:", newToken);
    } catch (error) {
      console.error("login failed:", error);
    }
  }

  return (
    <>
      <h1>Hello, this is my finance tracker</h1>
      <ul>
        <li>Track your spending</li>
        <li>Create your guilt-free spending plan</li>
      </ul>
      <ul>
        {buckets.map((bucket) => (
          <Bucket key={bucket.name} name={bucket.name} percent={bucket.percent} />

        ))}
      </ul>
      <Toolbar
        onPlayMovie={() => alert('Playing')}
        onUploadImage={() => alert('Uploading')}
      />
      <button onClick={handleLogin}>Log in</button>
      <p>{token ? "Logged in" : "Not logged in"}</p>
    </>
  );
}

export default App
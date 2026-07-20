import { useState } from 'react'
import { login } from './api/auth'
import { getUser, type UserResponse } from './api/user'
import Bucket from './components/Bucket'

const buckets = [
  { name: "Fixed Costs", percent: 55 },
  { name: "Investments", percent: 10 },
  { name: "Savings", percent: 8 },
  { name: "Guilt-Free Spending", percent: 27 },
];

function App() {
  const [token, setToken] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<UserResponse | null>(null)

  async function handleLogin() {
    try {
      const newToken = await login("user@example.com", "string");
      setToken(newToken);
      console.log("Token Recieved:", newToken);
    } catch (error) {
      console.error("login failed:", error);
    }
  }
  async function getUserInfo() {
    if (!token) {
      console.error("No token- Please log in first");
      return;
    }
    try {
      const newUserInfo = await getUser(token);
      setUserInfo(newUserInfo)
      console.log("User Info Recieved:", newUserInfo)
    } catch (error) {
      console.error("User Fetch Failed", error);
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
      <button onClick={handleLogin}>Log in</button>
      <p>{token ? "Logged in" : "Not logged in"}</p>
      <button onClick={getUserInfo}>get user info</button>
      <p>{userInfo ? userInfo.email : "No user loaded"}</p>
      <p>{userInfo ? userInfo.username : "No user loaded"}</p>
    </>
  );
}

export default App
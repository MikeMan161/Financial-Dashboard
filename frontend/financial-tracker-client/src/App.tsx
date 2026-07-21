import { useState } from 'react'
import { login } from './api/auth'
import { getUser, type UserResponse } from './api/user'
import { getBuckets, type BucketResponse } from './api/bucket'
import  Bucket  from './components/Bucket'

function App() {
  const [token, setToken] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<UserResponse | null>(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [bucketInfo, setBucketInfo]  = useState<BucketResponse[] | null>(null)

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
  
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const newToken = await login(email, password);
      setToken(newToken);
      console.log("Token Recieved:", newToken);
    } catch (error) {
      console.error("login failed:", error);
    }
  }
  async function getBucketInfo() {
    if (!token) {
      console.error("No token- Please log in first")
      return;
    }
    try {
      const newBucketInfo = await getBuckets(token);
      setBucketInfo(newBucketInfo)
      console.log("Bucket Information Recieved:", newBucketInfo)
    } catch (error) {
      console.error("Bucket Info Retrieval Failed: ", error)
    }
  }

  return (
    <>
      <h1>Hello, this is my finance tracker</h1>
      <ul>
        <li>Track your spending</li>
        <li>Create your guilt-free spending plan</li>
      </ul>
      <form onSubmit={handleSubmit}>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
        <button type="submit">Log in</button>
      </form>
      <p>{token ? "Logged in" : "Not logged in"}</p>
      <button onClick={getUserInfo}>get user info</button>
      <p>{userInfo ? userInfo.email : "No user loaded"}</p>
      <p>{userInfo ? userInfo.username : "No user loaded"}</p>
      <div>
        <button onClick={getBucketInfo}>Get bucket info</button>
        {bucketInfo?.map((bucket) => (
          <Bucket key={bucket.id} name={bucket.name} percent={bucket.target_percentage} />
        ))}

      </div>


    </>
  );
}

export default App
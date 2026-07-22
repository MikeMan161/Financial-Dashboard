import { useState } from 'react'
import { Navigate } from 'react-router'
import { getUser } from '../api/user'; 
import { UserCard } from '../components/User'
import type { UserResponse } from '../api/user';

type UserPageProps = {
    token: string | null;
};

export default function UserPage({ token }: UserPageProps) {
    const [userInfo, setUserInfo] = useState<UserResponse | null>(null)
    async function showUserCard() {
        if (!token) return;
        try {
            const data = await getUser(token);
            setUserInfo(data)
        } catch (error) {
            console.error(error);
        }
    }



    return (
        <>
            <button onClick={showUserCard}>Show User Information</button>
            { userInfo && <UserCard user={userInfo} />}
        </>
    )
}
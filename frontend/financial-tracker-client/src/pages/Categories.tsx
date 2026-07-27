import { useState } from 'react'
import { Navigate } from 'react-router'
import { getCategories } from '../api/category'; 
import { CategoryCard } from '../components/Category'
import type { CategoryResponse } from '../api/category';

type CategoryPageProps = {
    token: string | null;
    bucket_id: string
};

export default function CategoryPage({ token }: CategoryResponse, {bucket_id}: CategoryPageProps) {
    const [categoryInfo, setCategoryInfo] = useState<CategoryResponse | null>(null)
    async function showCategoryCard() {
        if (!token) return;
        try {
            const data = await getCategories(token, bucket_id);
            setCategoryInfo(data)
        } catch (error) {
            console.error(error);
        }
    }



    return (
        <>
            <button onClick={showCategoryCard}>Show User Information</button>
            { userInfo && <UserCard user={userInfo} />}
        </>
    )
}
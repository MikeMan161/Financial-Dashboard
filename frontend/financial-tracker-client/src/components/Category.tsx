import type { CategoryResponse } from "../api/category";

type CategoryCardProps = {
    category: CategoryResponse
}

export function CategoryCard ( { category }: CategoryCardProps) {
    return (
        <article>
            <header>
                <p>User Information:</p>
            </header>
            <ul>
                <li>Category ID: {category.id}</li>
                <li>User ID: {category.user_id}</li>
                <li>Bucket ID: {category.bucket_id}</li>
                <li>Name: {category.name}</li>
            </ul>
        </article>
    )
}
import type { UserResponse } from "../api/user"

type UserCardProps = {
    user: UserResponse
};

export function UserCard( { user }: UserCardProps) {
    return(
        <article>
            <header>
                <p>User Information:</p>
            </header>
            <ul>
                <li>Username: {user.username}</li>
                <li>Email: {user.email}</li>
                <li>Currency: {user.currency}</li>
            </ul>
        </article>
    )
}

//Need to make a component for displaying all valid currencies.
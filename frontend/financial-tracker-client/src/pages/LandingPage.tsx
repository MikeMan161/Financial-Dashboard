import { Link } from "react-router"

export default function LandingPage() {
    return (
        <>
            <Link to="/Login">Log In</Link>
            <Link to="/SignUp">Register</Link>
        </>
    )
}

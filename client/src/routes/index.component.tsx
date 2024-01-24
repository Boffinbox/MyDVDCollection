import { Link } from "@tanstack/react-router"

export const component = function Index()
{
    return (
        <>
            <div style={{ textAlign: "center" }} >
                <h2>My DVD Collection</h2>
                <p>Welcome to My DVD Collection! Your place for digitally tracking your DVDs, Blu-Rays, CDs, and more!</p>
                <p>
                    <Link
                        to="/collections"
                    >Get started!
                    </Link>
                </p>
            </div>
        </>
    )
}
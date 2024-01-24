import { FileRoute, Link } from "@tanstack/react-router"

export const Route = new FileRoute('/').createRoute({
    component: Index
})

function Index()
{
    return (
        <>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                <div style={{ textAlign: "center" }} >
                    <h2>My DVD Collection</h2>
                    <p>Welcome to My DVD Collection! Your place for digitally tracking your DVDs, Blu-Rays, CDs, and more!</p>
                    <p>
                        <Link
                            to="/login"
                        >Click here
                        </Link>
                        {` `}and get started!
                    </p>
                </div>
            </div>
        </>
    )
}
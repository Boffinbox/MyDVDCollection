import { createFileRoute, Link } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
import { AccessTokenQueryOptions } from "../utilities/Queries"

export const Route = createFileRoute('/')({
    beforeLoad: async ({ context: { queryClient } }) =>
    {
        queryClient.ensureQueryData(AccessTokenQueryOptions())
    },
    component: Index
})

function Index()
{
    const tokenQuery = useQuery(AccessTokenQueryOptions())

    if (tokenQuery.isLoading) return <h1>Loading...</h1>

    return (
        <>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                <div style={{ textAlign: "center" }} >
                    <h2>My DVD Collection</h2>
                    <p>Welcome to My DVD Collection! Your place for digitally tracking your DVDs, Blu-Rays, CDs, and more!</p>
                    <p>
                        {tokenQuery.isError ?
                            <Link
                                to="/login"
                            >Click here to login
                            </Link>
                            :
                            <Link
                                to="/collections"
                            >Click here
                            </Link>
                        }
                        {` `}and get started!
                    </p>
                </div>
            </div>
        </>
    )
}
import { createFileRoute, Link } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"

import { AccessTokenQueryOptions } from "../utilities/Queries"

import { Sheet } from '@mui/joy';

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

    return (
        <>
            <Sheet
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: 1,
                    textAlign: "center"
                }}>
                <h2>My DVD Collection</h2>
                <p>Welcome to My DVD Collection! Your place for digitally tracking your DVDs, Blu-Rays, CDs, and more!</p>
                <p>
                    {tokenQuery.isSuccess ?
                        <Link
                            to="/collections"
                        >Click here
                        </Link>
                        :
                        <Link
                            to="/login"
                        >Click here
                        </Link>
                    }
                    {` `}and get started!
                </p>
            </Sheet >
        </>
    )
}
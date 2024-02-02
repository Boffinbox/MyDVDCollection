import { createFileRoute, Link } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"

import { AccessTokenQueryOptions } from "../utilities/Queries"

import { Sheet, Typography } from '@mui/joy';

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
                <Typography level="h2" sx={{ py: 1, mx: 2 }}>
                    My DVD Collection
                </Typography>
                <Typography level="body-sm" sx={{ py: 1, mx: 2 }}>
                    Welcome to My DVD Collection! Your place for digitally tracking your DVDs, Blu-Rays, CDs, and more!
                </Typography>
                <Typography sx={{ py: 1, mx: 2 }}>
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
                </Typography>
            </Sheet >
        </>
    )
}
import { createFileRoute, Link as RouterLink } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"

import { AccessTokenQueryOptions } from "../../utilities/Queries"

import { Sheet, Typography, Link } from '@mui/joy';
import { DarkModeToggle } from "../../components/DarkModeToggle";

export const Route = createFileRoute('/_nonauth/home')({
    beforeLoad: async ({ context: { queryClient } }) =>
    {
        queryClient.ensureQueryData(AccessTokenQueryOptions())
    },
    component: Home
})

function Home()
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
                    height: "100dvh",
                    px: 2,
                    py: 2
                }}>
                <Sheet
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 2,
                        textAlign: "center",
                        height: "100%",
                    }}>
                    <Typography level="h2" sx={{ mx: 2 }} component="h1">
                        My DVD Collection
                    </Typography>
                    <Typography level="body-sm" sx={{ mx: 2 }}>
                        Welcome to My DVD Collection! Your place for digitally tracking your DVDs, Blu-Rays, CDs, and more!
                    </Typography>
                    <Typography sx={{ mx: 2 }}>
                        {tokenQuery.isSuccess ?
                            <RouterLink to="/collections">
                                <Link>Click here</Link>
                            </RouterLink>
                            :
                            <RouterLink to="/login">
                                <Link>Click here</Link>
                            </RouterLink>
                        }
                        {` `}and get started!
                    </Typography>
                </Sheet >
            </Sheet>
        </>
    )
}
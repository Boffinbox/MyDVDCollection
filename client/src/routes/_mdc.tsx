import { createFileRoute, Link as RouterLink, Outlet } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query';

import { AccessTokenQueryOptions } from '../utilities/Queries';

import { Sheet, Typography, ButtonGroup, Button, Link, Divider } from "@mui/joy"
import { DarkModeToggle } from '../components/DarkModeToggle';

export const Route = createFileRoute('/_mdc')({
    beforeLoad: async ({ context: { queryClient } }) =>
    {
        queryClient.ensureQueryData(AccessTokenQueryOptions())
    },
    component: MDCComponent
})

function MDCComponent()
{
    const tokenQuery = useQuery(AccessTokenQueryOptions())
    const token: string | undefined = tokenQuery.data;

    if (tokenQuery.status === "error") return (
        <>
            <div>Oh no! Something went wrong... 🙁</div>
            <p>
                <RouterLink to="/">
                    <Link>Click here to go to homepage...</Link>
                </RouterLink>{` `}
            </p>
            Error: {tokenQuery.error.message}
        </>
    )

    return (
        <>
            <Sheet
                sx={{
                    mx: 2,
                    mt: 2,
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    overflow: "scroll"
                }}>
                {tokenQuery.isLoading ?
                    <Sheet
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            height: "100%",
                            gap: 2,
                        }}>
                        <Typography
                            level="h1"
                        >
                            Loading...
                        </Typography>
                    </Sheet>
                    :
                    <Outlet />
                }
            </Sheet>
        </>
    )
}
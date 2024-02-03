import { createFileRoute, Link as RouterLink, Outlet } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query';

import { AccessTokenQueryOptions } from '../utilities/Queries';

import { Sheet, FormControl, FormLabel, Input, Button, Typography, Link } from "@mui/joy"
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

    if (tokenQuery.isLoading) return <h1>Loading...</h1>

    if (tokenQuery.status === "error") return (
        <>
            <div>Oh no! Something went wrong.</div>
            <p>
                <RouterLink to="/">
                    Click here to go to homepage...
                </RouterLink>{` `}
            </p>
            Error: {tokenQuery.error.message}
        </>
    )

    return (
        <>
            <Typography
                sx={{
                    backgroundColor: "rebeccapurple",
                    color: 'orange',
                    fontSize: "small",
                    fontWeight: 100,
                    wordBreak: "break-all"
                }}>
                Current token is: {token}
            </Typography>
            <DarkModeToggle />
            <Sheet
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: 1,
                    gap: 2,
                    textAlign: "center"
                }}>

                <div className="p-2 flex gap-2">
                    <RouterLink to="/">
                        Home
                    </RouterLink>{` `}
                    <RouterLink to="/logout">
                        Logout
                    </RouterLink>{` `}
                    <RouterLink to="/collections">
                        Collections
                    </RouterLink>
                </div>
                <Outlet />
            </Sheet>
        </>
    )
}
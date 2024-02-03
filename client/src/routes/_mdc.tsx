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
            <Sheet
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                }}>
                <Sheet
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        height: 1,
                        gap: 0.5,
                        textAlign: "center"
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
                                textAlign: "center"
                            }}>
                            <Typography
                                level="h1"
                            >
                                Loading...
                            </Typography>
                        </Sheet>
                        :
                        <>
                            <Sheet sx={{
                                display: "flex",
                                justifyContent: "space-between",
                            }}>
                                <ButtonGroup variant="plain">
                                    <RouterLink to="/">
                                        <Button>Home</Button>
                                    </RouterLink>{` `}
                                    <RouterLink to="/logout">
                                        <Button>Logout</Button>
                                    </RouterLink>{` `}
                                    <RouterLink to="/collections">
                                        <Button>Collections</Button>
                                    </RouterLink>
                                </ButtonGroup>
                                <DarkModeToggle />
                            </Sheet>
                            <Divider />
                            <Outlet />
                        </>}
                </Sheet>
            </Sheet >
        </>
    )
}
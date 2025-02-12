import { createFileRoute, Link as RouterLink, Outlet } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query';

import { AccessTokenQueryOptions, CollectionsQueryOptions } from '../utilities/Queries';

import { Sheet, Typography, Link } from "@mui/joy";
import { MdcAppbar } from '../components/MdcAppbar';

export const Route = createFileRoute('/_mdc')({
    beforeLoad: async ({ context: { queryClient } }) =>
    {
        const data = await queryClient.ensureQueryData(AccessTokenQueryOptions())
        await queryClient.ensureQueryData(CollectionsQueryOptions(data))
    },
    component: MDCComponent
})

function MDCComponent()
{
    const tokenQuery = useQuery(AccessTokenQueryOptions())
    // const token: string | undefined = tokenQuery.data;

    if (tokenQuery.status === "error") return (
        <>
            <div>Oh no! Something went wrong... 🙁</div>
            <p>
                <RouterLink to="/home">
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
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: "space-between",
                    gap: 0,
                    height: "100dvh"
                }}
            >
                <Sheet
                    sx={{
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
                        <Sheet sx={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            height: "100%",
                            m: 2
                        }}>
                            <Outlet />
                        </Sheet>
                    }
                </Sheet>
                <MdcAppbar />
            </Sheet >
        </>
    )
}
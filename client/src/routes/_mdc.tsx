import { createFileRoute, Link as RouterLink, Outlet, redirect } from '@tanstack/react-router'
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { AccessTokenQueryOptions, CollectionsQueryOptions } from '../utilities/Queries';

import { Sheet, Typography, Link } from "@mui/joy";
import { MdcAppbar } from '../components/MdcAppbar';
import { ScrollContext } from '../components/ScrollContextProvider';
import { useContext } from 'react';

export const Route = createFileRoute('/_mdc')({
    beforeLoad: async ({ context: { queryClient } }) =>
    {
        await queryClient.ensureQueryData(AccessTokenQueryOptions())
    },
    component: MDCComponent
})

function MDCComponent()
{
    const tokenQuery = useQuery(AccessTokenQueryOptions())
    // const token: string | undefined = tokenQuery.data;

    const scrollContext = useContext(ScrollContext)

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
                        overflow: "auto"
                    }}
                    ref={scrollContext.scrollRef}
                >
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
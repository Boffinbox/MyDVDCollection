import { createFileRoute, Link as RouterLink, Outlet } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query';

import { AccessTokenQueryOptions, CollectionsQueryOptions } from '../utilities/Queries';

import { Sheet, Typography, Link } from "@mui/joy";
import { MdcAppbar } from '../components/MdcAppbar';

export const Route = createFileRoute('/_webcam')({
    beforeLoad: async ({ context: { queryClient } }) =>
    {
        const data = await queryClient.ensureQueryData(AccessTokenQueryOptions())
        await queryClient.ensureQueryData(CollectionsQueryOptions(data))
    },
    component: WebcamComponent
})

function WebcamComponent()
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
                    height: "100dvh",
                    overflow: "hidden"
                }}
            >
                {tokenQuery.isLoading ?
                    <Sheet
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            height: "100%"
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
                <MdcAppbar />
            </Sheet >
        </>
    )
}
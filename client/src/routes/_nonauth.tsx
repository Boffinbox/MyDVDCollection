import { createFileRoute, Outlet } from '@tanstack/react-router'

import { AccessTokenQueryOptions } from '../utilities/Queries';

import { Sheet, Typography } from '@mui/joy';

export const Route = createFileRoute('/_nonauth')({
    beforeLoad: async ({ context: { queryClient } }) =>
    {
        queryClient.ensureQueryData(AccessTokenQueryOptions())
    },
    component: NonAuthComponent
})

function NonAuthComponent()
{
    return (
        <>
            <Sheet
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: "space-between",
                    gap: 0,
                    height: "100vh",
                }}
            >
                <Outlet />
                <Typography sx={{ backgroundColor: "orange" }}>appbar goes here</Typography>
                <Typography sx={{ backgroundColor: "orange" }}>appbar goes here</Typography>
                <Typography sx={{ backgroundColor: "orange" }}>appbar goes here</Typography>
            </Sheet>
        </>
    )
}
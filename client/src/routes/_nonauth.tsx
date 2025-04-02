import { createFileRoute, Outlet } from '@tanstack/react-router'

import { AccessTokenQueryOptions } from '../utilities/Queries';

import { Sheet } from '@mui/joy';
import { NonAuthAppbar } from '../components/NonAuthAppbar';

export const Route = createFileRoute('/_nonauth')({
    beforeLoad: async ({ context: { queryClient } }) =>
    {
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
                    height: "100dvh",
                }}
            >
                <Outlet />
                <NonAuthAppbar />
            </Sheet >
        </>
    )
}
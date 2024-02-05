import { createFileRoute, Link as RouterLink, Outlet } from '@tanstack/react-router'

import { AccessTokenQueryOptions } from '../utilities/Queries';

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
            <Outlet />
        </>
    )
}
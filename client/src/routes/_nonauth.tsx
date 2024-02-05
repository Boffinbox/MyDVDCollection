import { createFileRoute, Outlet, Link as RouterLink } from '@tanstack/react-router'

import { AccessTokenQueryOptions } from '../utilities/Queries';

import { Button, ButtonGroup, Sheet } from '@mui/joy';
import { DarkModeToggle } from '../components/DarkModeToggle';

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
                <ButtonGroup
                    variant="plain"
                    buttonFlex={1}
                    size="lg"
                >
                    <RouterLink to="/home">
                        <Button>Home</Button>
                    </RouterLink>{` `}
                    <RouterLink to="/collections">
                        <Button>Collections</Button>
                    </RouterLink>
                    <RouterLink to="/login">
                        <Button>Login</Button>
                    </RouterLink>{` `}
                    <DarkModeToggle />
                </ButtonGroup>
            </Sheet>
        </>
    )
}
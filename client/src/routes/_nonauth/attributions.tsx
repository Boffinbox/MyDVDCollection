import { createFileRoute, Link as RouterLink } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'

import { AccessTokenQueryOptions } from '../../utilities/Queries'

import { Sheet, Typography, Link } from '@mui/joy'

export const Route = createFileRoute('/_nonauth/attributions')({
    beforeLoad: async ({ context: { queryClient } }) => { },
    component: Attributions,
})

function Attributions()
{
    const tokenQuery = useQuery(AccessTokenQueryOptions())

    return (
        <>
            <Sheet
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100dvh',
                    px: 2,
                    py: 2,
                }}
            >
                <Sheet
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 2,
                        textAlign: 'center',
                        height: '100%',
                    }}
                >
                    <Typography level="h2" sx={{ mx: 2 }} component="h1">
                        Attributions
                    </Typography>
                    <Typography level="body-sm" sx={{ mx: 2 }}>
                        <a
                            href="https://www.flaticon.com/free-icons/bluray"
                            title="bluray icons"
                        >
                            Bluray icons created by Freepik - Flaticon
                        </a>
                    </Typography>
                    <Typography sx={{ mx: 2 }}>
                        <Link component={RouterLink} to="/home">
                            Go back
                        </Link>
                    </Typography>
                </Sheet>
            </Sheet>
        </>
    )
}

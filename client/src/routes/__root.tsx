import { rootRouteWithContext, Outlet } from '@tanstack/react-router'
import { QueryClient } from '@tanstack/react-query';

import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

import { CssVarsProvider } from '@mui/joy/styles';
import { CssBaseline, Sheet } from '@mui/joy';
import { DarkModeToggle } from '../components/DarkModeToggle';

export const Route = rootRouteWithContext<{
    queryClient: QueryClient
}>()({
    component: App
})

function App()
{
    return <div>
        <CssVarsProvider>
            <CssBaseline>
                <DarkModeToggle />
                <Sheet
                    variant='solid'
                    sx={{
                        width: { md: 900 },
                        mx: "auto",
                        my: "auto",
                        py: 3, // padding top & bottom
                        px: 2, // padding left & right
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        backgroundColor: { xs: "pink", sm: "lightgreen", md: "lightblue" },
                        height: "100vh",
                    }}
                >
                    <Outlet />
                </Sheet>
            </CssBaseline>
        </CssVarsProvider>
        <ReactQueryDevtools buttonPosition='top-right' position='right' />
        <TanStackRouterDevtools position='bottom-right' />
    </div >
}
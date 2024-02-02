import { rootRouteWithContext, Outlet, redirect } from '@tanstack/react-router'
import { QueryClient } from '@tanstack/react-query';

import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

import { CssVarsProvider } from '@mui/joy/styles';
import { CssBaseline, Sheet } from '@mui/joy';

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
                <Sheet
                    variant='outlined'
                    sx={{
                        width: { md: 900 },
                        mx: "auto",
                        backgroundColor: { xs: "pink", sm: "lightgreen", md: "lightblue" },
                        py: 3, // padding top & bottom
                        px: 2, // padding left & right
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
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
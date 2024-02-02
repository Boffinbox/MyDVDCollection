import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';

import { rootRouteWithContext, Outlet } from '@tanstack/react-router'
import { QueryClient } from '@tanstack/react-query';

import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

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
                <Outlet />
            </CssBaseline>
        </CssVarsProvider>
        <ReactQueryDevtools buttonPosition='top-right' position='right' />
        <TanStackRouterDevtools position='bottom-right' />
    </div >
}
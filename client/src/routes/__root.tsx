import { rootRouteWithContext } from '@tanstack/react-router'
import { IAuth } from '../utilities/Auth';

import { Outlet } from "@tanstack/react-router";
import { QueryClient } from '@tanstack/react-query';
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

export const Route = rootRouteWithContext<{
    auth: IAuth,
    queryClient: QueryClient
}>()({
    component: App
})

function App()
{
    return <div>
        <Outlet />
        <ReactQueryDevtools buttonPosition='top-right' position='right' />
        <TanStackRouterDevtools position='bottom-right' />
    </div >
}
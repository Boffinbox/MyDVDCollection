import { rootRouteWithContext } from '@tanstack/react-router'
import { IAuth } from '../utilities/Auth';

import { Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

export const Route = rootRouteWithContext<{
    auth: IAuth
}>()({
    component: App
})

function App()
{
    return <div>
        <Outlet />
        <TanStackRouterDevtools />
    </div >
}
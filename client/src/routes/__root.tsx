import { rootRouteWithContext } from '@tanstack/react-router'
import { auth, IAuth } from '../utilities/Auth';

import { Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

export const Route = rootRouteWithContext<{
    auth: IAuth
}>()({
    beforeLoad: async () =>
    {
        if (auth.status == "loggedOut" || auth.token == undefined)
        {
            await auth.refreshAccessToken();
        }
    },
    component: App
})

function App()
{
    const { token, status } = Route.useRouteContext({ select: ({ auth }) => ({ token: auth.token, status: auth.status }) })

    return <div>
        <p>Current token is: {token}</p>
        <p>Status: {status}</p>
        <hr />
        <h1>My DVD Collection</h1>
        <div className="p-2 flex gap-2">
            <Link to="/" className="[&.active]:font-bold">
                Home
            </Link>{` `}
            <Link to="/login" className="[&.active]:font-bold">
                Login
            </Link>{` `}
            <Link to="/collections" className="[&.active]:font-bold">
                Collections
            </Link>
        </div>
        <hr />
        <Outlet />
        <TanStackRouterDevtools />
    </div >
}
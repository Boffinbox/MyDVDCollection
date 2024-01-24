import { FileRoute, Link, Outlet, redirect } from '@tanstack/react-router'
import { auth } from '../utilities/Auth';

export const Route = new FileRoute('/_mdc').createRoute({
    beforeLoad: async () =>
    {
        if (auth.status == "loggedOut" || auth.token == undefined)
        {
            await auth.refreshAccessToken();
            if (auth.status == "loggedOut" || auth.token == undefined)
            {
                throw redirect({
                    to: "/login"
                })
            }
        }
    },
    component: MDCComponent
})

function MDCComponent()
{
    const { token, status } = Route.useRouteContext({ select: ({ auth }) => ({ token: auth.token, status: auth.status }) })
    return (
        <>
            <div>
                <div style={{ backgroundColor: "rebeccapurple", color: 'orange', fontSize: "small", fontWeight: 100 }}>
                    <p>Current token is: {token}</p>
                    <p>Status: {status}</p>
                </div>
                <hr />
            </div>
            <h1>My DVD Collection</h1>
            <div className="p-2 flex gap-2">
                <Link to="/" className="[&.active]:font-bold">
                    Home
                </Link>{` `}
                <Link to="/logout" className="[&.active]:font-bold">
                    Logout
                </Link>{` `}
                <Link to="/collections" className="[&.active]:font-bold">
                    Collections
                </Link>
            </div>
            <hr />
            <Outlet />
        </>
    )
}
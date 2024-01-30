import { createFileRoute, Link, Outlet } from '@tanstack/react-router'
import { auth } from '../utilities/Auth';

export const Route = createFileRoute('/_mdc')({
    beforeLoad: async () =>
    {
        if (auth.status == "loggedOut" || auth.token == undefined)
        {
            await auth.refreshAccessToken();
        }
    },
    component: MDCComponent
})

function MDCComponent()
{
    const { token, status } = Route.useRouteContext({ select: ({ auth }) => ({ token: auth.token, status: auth.status }) })
    return status !== "loggedIn" ? (
        <>
            <div>You are not logged in!</div>
            <p>
                <Link to="/login">
                    Click here to login...
                </Link>{` `}
            </p>
        </>
    ) : (
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
                <Link to="/">
                    Home
                </Link>{` `}
                <Link to="/logout">
                    Logout
                </Link>{` `}
                <Link to="/collections">
                    Collections
                </Link>
            </div>
            <hr />
            <Outlet />
        </>
    )
}
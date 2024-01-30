import { createFileRoute, Link, Outlet } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query';
import { AccessTokenQueryOptions } from '../utilities/Queries';

export const Route = createFileRoute('/_mdc')({
    beforeLoad: async ({ context: { queryClient } }) =>
    {
        queryClient.ensureQueryData(AccessTokenQueryOptions())
    },
    component: MDCComponent
})

function MDCComponent()
{
    const tokenQuery = useQuery(AccessTokenQueryOptions())
    const token: string | undefined = tokenQuery.data;

    if (tokenQuery.isLoading) return <h1>Loading...</h1>

    if (tokenQuery.status === "error") return (
        <>
            <div>Oh no! Something went wrong.</div>
            <p>
                <Link to="/">
                    Click here to go to homepage...
                </Link>{` `}
            </p>
            Error: {tokenQuery.error.message}
        </>
    )

    return (
        <>
            <div>
                <div style={{ backgroundColor: "rebeccapurple", color: 'orange', fontSize: "small", fontWeight: 100 }}>
                    <p>Current token is: {token}</p>
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
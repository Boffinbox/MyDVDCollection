import { FileRoute, Link } from "@tanstack/react-router"
import { auth } from '../utilities/Auth';

export const Route = new FileRoute('/').createRoute({
    beforeLoad: async () =>
    {
        if (auth.status == "loggedOut" || auth.token == undefined)
        {
            await auth.refreshAccessToken();
        }
    },
    component: Index
})

function Index()
{
    const { status } = Route.useRouteContext({ select: ({ auth }) => ({ status: auth.status }) })

    return (
        <>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                <div style={{ textAlign: "center" }} >
                    <h2>My DVD Collection</h2>
                    <p>Welcome to My DVD Collection! Your place for digitally tracking your DVDs, Blu-Rays, CDs, and more!</p>
                    <p>
                        {status === "loggedOut" ?
                            <Link
                                to="/login"
                            >Click here to login
                            </Link>
                            :
                            <Link
                                to="/collections"
                            >Click here
                            </Link>
                        }
                        {` `}and get started!
                    </p>
                </div>
            </div>
        </>
    )
}
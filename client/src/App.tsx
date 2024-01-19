import { UserContext } from "./utilities/UserContext"
import { useState } from "react";
import LoginRefresh from "./utilities/LoginRefresh";

import { Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

import { Route } from "./routes/__root";

export function App()
{
    const [userToken, setUserToken] = useState<string>("");

    const { auth } = Route.useRouteContext({ select: ({ auth }) => ({ auth }) })

    return <div>
        <UserContext.Provider value={{ userToken, setUserToken }}>
            Current token is: {auth.token}
            <LoginRefresh />
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
        </UserContext.Provider>
    </div >
}
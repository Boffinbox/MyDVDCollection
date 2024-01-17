import { UserContext } from "./utilities/UserContext"
import { useState } from "react";
import LoginRefresh from "./utilities/LoginRefresh";

import { Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

export function App()
{
    const [userToken, setUserToken] = useState<string>("");

    return <div>
        <UserContext.Provider value={{ userToken, setUserToken }}>
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
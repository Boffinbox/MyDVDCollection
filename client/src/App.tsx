import { UserContext } from "./components/UserContext"
import { useState } from "react";
import LoginRefresh from "./components/LoginRefresh";

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
                </Link>{' '}
                <Link to="/about" className="[&.active]:font-bold">
                    About
                </Link>
            </div>
            <hr />
            <Outlet />
            <TanStackRouterDevtools />
        </UserContext.Provider>
    </div >
}
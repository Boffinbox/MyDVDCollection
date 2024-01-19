import { useState } from "react";
import LoginRefresh from "./utilities/LoginRefresh";

import { Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

import { Route } from "./routes/__root";

export function App()
{
    const { auth } = Route.useRouteContext({ select: ({ auth }) => ({ auth }) })

    return <div>
        <p>Current token is: {auth.token}</p>
        <p>Status: {auth.status}</p>
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
import { UserContext } from "./components/UserContext"
import { useState } from "react";
import LoginRefresh from "./components/LoginRefresh";
import { Link, Outlet } from "@tanstack/react-router";

export function App()
{
    const [userToken, setUserToken] = useState<string>("");

    return <div>
        <UserContext.Provider value={{ userToken, setUserToken }}>
            <LoginRefresh />
            <nav>
                <Link to="/">Index</Link>
                <Link to="/login">Login</Link>
                <Link to="/collections">Collections</Link>
            </nav>
            <Outlet />
        </UserContext.Provider>
    </div >
}
import { UserContext } from "./components/UserContext"
import { useState } from "react";
import LoginRefresh from "./components/LoginRefresh";
import Login from "./routes/login";

export function App()
{
    const [userToken, setUserToken] = useState<string>("");

    return <div>
        <UserContext.Provider value={{ userToken, setUserToken }}>
            <LoginRefresh />
            Main page
            <Login />
        </UserContext.Provider>
    </div >
}
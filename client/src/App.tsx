import "./App.css"

import { useState } from "react"
import { UserContext } from "./UserContext"

import { LoginRefresh } from "./LoginRefresh"

function App()
{
    const [userToken, setUserToken] = useState<string>("");
    return (
        <UserContext.Provider value={{ userToken, setUserToken }}>
            <div>
                <LoginRefresh />
            </div >
        </UserContext.Provider>
    )
}

export default App

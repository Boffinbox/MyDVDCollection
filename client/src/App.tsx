import "./App.css"
import { TestCollectionRender } from "./TestCollectionRender"
import { TestCollectionSubmit } from "./TestCollectionSubmit"
import { TestDVDSubmit } from "./TestDVDSubmit"
import { TestLoginSubmit } from "./TestLoginSubmit"

import { useState } from "react"
import { UserContext } from "./UserContext"
import { TestLoginRefresh } from "./TestLoginRefresh"

function App()
{
    const [userToken, setUserToken] = useState<string>("");
    return (
        <UserContext.Provider value={{ userToken, setUserToken }}>
            <div>
                <TestLoginRefresh />
                <TestDVDSubmit />
                <TestLoginSubmit />
                <TestCollectionSubmit />
                <TestCollectionRender />
            </div >
        </UserContext.Provider>
    )
}

export default App

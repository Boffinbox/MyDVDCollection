import "./App.css"
import { TestCollectionRender } from "./TestCollectionRender"
import { TestCollectionSubmit } from "./TestCollectionSubmit"
import { TestCollectionAddDVD } from "./TestCollectionAddDVD"
import { TestDVDSubmit } from "./TestDVDSubmit"
import { TestLoginSubmit } from "./TestLoginSubmit"

import { useState } from "react"
import { UserContext } from "./TestUserContext"

function App()
{
    const [token, setToken] = useState<string>("");
    return (
        <UserContext.Provider value={{ token, setToken }}>
            <div>
                <TestDVDSubmit />
                <TestLoginSubmit />
                <TestCollectionSubmit />
                <TestCollectionAddDVD />
                <TestCollectionRender />
            </div >
        </UserContext.Provider>
    )
}

export default App

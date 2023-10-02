import "./App.css"
import { TestCollectionRender } from "./TestCollectionRender"

import { TestCollectionSubmit } from "./TestCollectionSubmit"
import { TestDVDSubmit } from "./TestDVDSubmit"

function App()
{
    return (
        <div>
            {/* <TestDVDSubmit /> */}
            <TestCollectionSubmit />
            <TestCollectionRender />
        </div>
    )
}

export default App

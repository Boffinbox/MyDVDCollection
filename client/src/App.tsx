import "./App.css"
import { TestCollectionRemove } from "./TestCollectionRemove"
import { TestCollectionRender } from "./TestCollectionRender"

import { TestCollectionSubmit } from "./TestCollectionSubmit"
import { TestDVDSubmit } from "./TestDVDSubmit"

function App()
{
    return (
        <div>
            {/* <TestDVDSubmit /> */}
            <TestCollectionRemove />
            <TestCollectionRender />
        </div>
    )
}

export default App

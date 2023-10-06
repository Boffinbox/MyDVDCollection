import "./App.css"
import { TestCollectionRemove } from "./TestCollectionRemove"
import { TestCollectionRender } from "./TestCollectionRender"

import { TestCollectionSubmit } from "./TestCollectionSubmit"
import { TestCollectionUpdate } from "./TestCollectionUpdate"
import { TestDVDSubmit } from "./TestDVDSubmit"

function App()
{
    return (
        <div>
            <TestDVDSubmit />
            <TestCollectionSubmit />
            <TestCollectionRemove />
            <TestCollectionUpdate />
            <TestCollectionRender />
        </div >
    )
}

export default App

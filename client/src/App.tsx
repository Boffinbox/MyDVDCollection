import "./App.css"
import { TestCollectionRemove } from "./TestCollectionRemove"
import { TestCollectionRender } from "./TestCollectionRender"

import { TestCollectionSubmit } from "./TestCollectionSubmit"
import { TestCollectionAddDVD } from "./TestCollectionAddDVD"
import { TestDVDSubmit } from "./TestDVDSubmit"
import { TestCollectionRemoveDVD } from "./TestCollectionRemoveDVD"

function App()
{
    return (
        <div>
            <TestDVDSubmit />
            <TestCollectionSubmit />
            <TestCollectionRemove />
            <TestCollectionAddDVD />
            <TestCollectionRemoveDVD />
            <TestCollectionRender />
        </div >
    )
}

export default App

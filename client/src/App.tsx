import "./App.css"
import { TestCollectionRender } from "./TestCollectionRender"
import { TestCollectionSubmit } from "./TestCollectionSubmit"
import { TestCollectionAddDVD } from "./TestCollectionAddDVD"
import { TestDVDSubmit } from "./TestDVDSubmit"
import { TestLoginSubmit } from "./TestLoginSubmit"

function App()
{
    return (
        <div>
            <TestDVDSubmit />
            <TestLoginSubmit />
            <TestCollectionSubmit />
            <TestCollectionAddDVD />
            <TestCollectionRender />
        </div >
    )
}

export default App

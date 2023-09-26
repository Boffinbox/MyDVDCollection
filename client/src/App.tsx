import axios from "axios"
import "./App.css"

import { useState, useEffect } from "react"

interface IData
{
    dvds: string[]
}

function App()
{
    const [data, setData] = useState<IData>({ dvds: ["test"] })

    useEffect(() =>
    {
        axios.get("/api")
            .then((response) =>
            {
                console.log(response.data);
                setData(response.data);
            })
    }, [])

    return (
        <div>
            {data.dvds.map((d, i) => <div key={i}>{d}</div>)}
            {JSON.stringify(data)}
        </div>
    )
}

export default App

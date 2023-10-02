import { IDVD, IData } from "../Interfaces"

import axios from "axios"
import { useState, useEffect } from "react"

export function TestDVDSubmit()
{
    function defaultFormData()
    {
        return { title: ``, barcode: `` }
    }

    const [data, setData] = useState<IData[]>([{ _id: "1", title: "nodata", barcode: "check line 22", __v: 1 }])
    const [formData, setFormData] = useState<IDVD>(defaultFormData)

    function getCurrentData()
    {
        axios.get("/api/dvds")
            .then((response) =>
            {
                console.log("our data is: ", response.data);
                setData((prevData) => response.data);
            })
    }

    useEffect(() =>
    {
        getCurrentData();
    }, [])

    function handleChange(evt: React.ChangeEvent<HTMLInputElement>)
    {
        setFormData(currentData =>
        {
            return {
                ...currentData,
                [evt.target.name]: evt.target.value
            }
        })
    }

    function handleSubmit(evt: React.FormEvent<HTMLFormElement>)
    {
        evt.preventDefault();
        console.log("Form submitted!");
        const userData =
        {
            title: formData.title,
            barcode: formData.barcode,
        };
        axios.post("/api/dvds", userData).then((response) =>
        {
            console.log("Post request sent.");
            console.log(response.data);
            getCurrentData();
        }).catch((e) =>
        {
            console.log(e);
        })
        setFormData(defaultFormData);
    }

    return (
        <div>
            <div>
                {data.map((dvd) =>
                {
                    return <p>{dvd.title}, {dvd.barcode}</p>
                })}
            </div>
            <div style={{ backgroundColor: "darkblue" }}>
                <form action="" onSubmit={handleSubmit}>
                    <p>basic form</p>
                    <div>
                        <label htmlFor="title">Title</label>
                        <input type="text" id="title" name="title" onChange={handleChange} value={formData.title} />
                    </div>
                    <div>
                        <label htmlFor="barcode">Barcode</label>
                        <input type="text" id="barcode" name="barcode" onChange={handleChange} value={formData.barcode} />
                    </div>
                    <button>Submit!</button>
                </form>
            </div>
        </div>
    )
}
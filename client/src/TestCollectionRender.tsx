import { useState, useEffect } from "react";
import axios from "axios"

interface IDiscCollectionData
{
    _id: string;
    title: string;
    discs: [
        {
            title: string;
            barcode: string;
        }
    ];
    __v: number;
}

export function TestCollectionRender()
{
    const [data, setData] = useState<IDiscCollectionData[]>([]);

    function getCurrentData()
    {
        axios.get("/api/v1/disccollections/")
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

    function handleSubmit(evt: React.FormEvent<HTMLFormElement>)
    {
        evt.preventDefault();
        axios.post(`/api/v1/disccollections/${formData.id}/dvds/${formData.barcode}`).then((response) =>
        {
            console.log("Post request received.");
        }).catch((e) =>
        {
            console.log(e);
        })
    }

    return (
        <div>
            All Collections:
            <br />
            <br />
            {data.map((coll, idx) =>
            {
                return <>
                    <p>Collection {idx + 1}: {coll.title}, with secret id of: {coll._id}.</p>
                    <p> DVDS: { }
                        {coll.discs.map((disc) =>
                        {
                            return <>
                                {disc.title}, with barcode: {disc.barcode}.
                                <form action="" onSubmit={function (evt)
                                {
                                    evt.preventDefault();
                                    axios.delete(`/api/v1/disccollections/${coll._id}/dvds/${disc.barcode}`).then((response) =>
                                    {
                                        console.log("Post request received.");
                                    }).catch((e) =>
                                    {
                                        console.log(e);
                                    })
                                }
                                }>
                                    <button>Remove</button>
                                </form>
                            </>
                        })}</p >
                    <br />
                </>
            })}
        </div >
    )
}
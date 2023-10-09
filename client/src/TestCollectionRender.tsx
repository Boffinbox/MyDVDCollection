import { useState, useEffect } from "react";
import axios from "axios"

interface IDiscCollectionData
{
    _id: string;
    title: string;
    discs: [
        {
            _id: string;
            referenceDVD: {
                title: string;
                barcode: string;
            },
            rating: number;
            watched: boolean;
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


    return (
        <div>
            All Collections:
            <br />
            <br />
            {data.map((coll, idx) =>
            {
                return <>
                    <p>Collection {idx + 1}: {coll.title}, with secret id of: {coll._id}.
                        <form action="" onSubmit={function (evt)
                        {
                            evt.preventDefault();
                            axios.delete(`/api/v1/disccollections/${coll._id}`).then((response) =>
                            {
                                console.log("Delete request received.");
                            }).catch((e) =>
                            {
                                console.log(e);
                            })
                        }
                        }>
                            <button>Click to delete collection.</button>
                        </form></p>
                    <p> DVDS: { }
                        {coll.discs.map((disc) =>
                        {
                            return <>
                                {disc.referenceDVD.title}, with barcode: {disc.referenceDVD.barcode}. rating is: {disc.rating},
                                watched? {disc.watched.toString()}
                                <form action="" onSubmit={function (evt)
                                {
                                    evt.preventDefault();
                                    const userData =
                                    {
                                        rating: disc.rating + 1,
                                        watched: !disc.watched
                                    }
                                    axios.patch(`/api/v1/disccollections/${coll._id}/dvds/${disc._id}`, userData).then((response) =>
                                    {
                                        console.log("Delete request received.");
                                    }).catch((e) =>
                                    {
                                        console.log(e);
                                    })
                                }
                                }>
                                    <button>Click to increase rating and toggle watched</button>
                                </form>
                                <form action="" onSubmit={function (evt)
                                {
                                    evt.preventDefault();
                                    axios.delete(`/api/v1/disccollections/${coll._id}/dvds/${disc._id}`).then((response) =>
                                    {
                                        console.log("Delete request received.");
                                    }).catch((e) =>
                                    {
                                        console.log(e);
                                    })
                                }
                                }>
                                    <button>Click to delete dvd</button>
                                </form>
                            </>
                        })}</p >
                    <br />
                </>
            })}
        </div >
    )
}
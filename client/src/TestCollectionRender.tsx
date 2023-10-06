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

    return (
        <div>
            {data.map((coll) =>
            {
                return <p>{coll._id}, {coll.title}, { }
                    {coll.discs.map((disc) =>
                    {
                        return <>{disc.title}, {disc.barcode}, </>
                    })}</p>
            })}
        </div>
    )
}
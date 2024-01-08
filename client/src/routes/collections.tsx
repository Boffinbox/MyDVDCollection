import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { UserContext } from "../components/UserContext";

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

export default function Collections()
{
    const [data, setData] = useState<IDiscCollectionData[]>([]);
    const user = useContext(UserContext)

    function getCurrentData()
    {
        const config =
        {
            headers: { Authorization: `Bearer ${user.userToken}` }
        }
        axios.get("/api/v1/disccollections/", config).then((response) =>
        {
            console.log("our data is: ", response.data);
            setData(() => response.data);
        })
    }

    useEffect(() =>
    {
        getCurrentData();
    }, [])

    return (
        <>
            All Collections for user:
            user token is: {user.userToken}
            <br />
            {data.map((coll, idx) =>
            {
                return <>
                    <p>Collection {idx + 1}: {coll.title}, with secret id of: {coll._id}.
                        <form action="" onSubmit={function (evt)
                        {
                            evt.preventDefault();
                            const config =
                            {
                                headers: { Authorization: `Bearer ${user.userToken}` }
                            }
                            axios.delete(`/api/v1/disccollections/${coll._id}`, config).then(() =>
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
                                    axios.patch(`/api/v1/disccollections/${coll._id}/userdvds/${disc._id}`, userData).then(() =>
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
                                    axios.delete(`/api/v1/disccollections/${coll._id}/userdvds/${disc._id}`).then(() =>
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
        </>
    )
}
import { useState, useEffect, useContext } from "react";
import axios from "axios"
import { UserContext } from "./TestUserContext";

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
    const [formData, setFormData] = useState({ id: "", barcode: "" })
    const user = useContext(UserContext);

    function getCurrentData()
    {
        axios.get("/api/v1/disccollections/")
            .then((response) =>
            {
                console.log("our data is: ", response.data);
                setData(() => response.data);
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
        console.log("Coll ID to modify is: ", formData.id);
        console.log("Barcode to add: ", formData.barcode);
        axios.post(`/api/v1/disccollections/${formData.id}/dvds/${formData.barcode}`).then(() =>
        {
            console.log("Post request received.");
            getCurrentData();
        }).catch((e) =>
        {
            console.log(e);
        })
    }

    return (
        <div>
            <div style={{ backgroundColor: "darkblue" }}>
                <form action="" onSubmit={handleSubmit}>
                    <p>basic form to add dvd to collection</p>
                    <div>
                        <label htmlFor="id">id of collection to modify</label>
                        <input type="text" id="id" name="id" onChange={handleChange} value={formData.id} />
                    </div>
                    <div>
                        <label htmlFor="barcode">barcode to modify</label>
                        <input type="text" id="barcode" name="barcode" onChange={handleChange} value={formData.barcode} />
                    </div>
                    <button>Submit!</button>
                </form>
            </div>
            All Collections for user:
            user token is: {user.token}
            <br />
            {data.map((coll, idx) =>
            {
                return <>
                    <p>Collection {idx + 1}: {coll.title}, with secret id of: {coll._id}.
                        <form action="" onSubmit={function (evt)
                        {
                            evt.preventDefault();
                            axios.delete(`/api/v1/disccollections/${coll._id}`).then(() =>
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
                                    axios.patch(`/api/v1/disccollections/${coll._id}/dvds/${disc._id}`, userData).then(() =>
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
                                    axios.delete(`/api/v1/disccollections/${coll._id}/dvds/${disc._id}`).then(() =>
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
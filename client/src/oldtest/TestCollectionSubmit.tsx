import axios from "axios";
import { useState, useContext } from "react";
import { UserContext } from "../UserContext";

export function TestCollectionSubmit()
{
    const [formData, setFormData] = useState({ title: "" })
    const user = useContext(UserContext);

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
            title: formData.title
        }
        const config =
        {
            headers: { Authorization: `Bearer ${user.userToken}` }
        }
        axios.post("/api/v1/disccollections", userData, config).then((response) =>
        {
            console.log("Post request sent.");
            console.log(response.data);
        }).catch((e) =>
        {
            console.log(e);
        })
    }

    return (
        <div>
            <div style={{ backgroundColor: "darkblue" }}>
                <form action="" onSubmit={handleSubmit}>
                    <p>add a new collection</p>
                    <div>
                        <label htmlFor="title">Title</label>
                        <input type="text" id="title" name="title" onChange={handleChange} value={formData.title} />
                    </div>
                    <button>Submit!</button>
                </form>
            </div>
        </div>
    )
}
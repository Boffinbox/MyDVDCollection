import axios from "axios";
import { useState } from "react";

export function TestCollectionSubmit()
{
    const [formData, setFormData] = useState({ title: "" })

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
        axios.post("/api/v1/disccollections", userData).then((response) =>
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
                    <p>basic form</p>
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
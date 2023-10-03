import axios from "axios";
import { useState } from "react";

export function TestCollectionRemove()
{
    const [formData, setFormData] = useState({ id: "" })

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
        console.log(formData.id);
        axios.delete(`/api/v1/disccollections/${formData.id}`).then((response) =>
        {
            console.log("Delete request received.");
            console.log("Collection deleted was: ", response.data);
        }).catch((e) =>
        {
            console.log(e);
        })
    }

    return (
        <div>
            <div style={{ backgroundColor: "darkblue" }}>
                <form action="" onSubmit={handleSubmit}>
                    <p>basic form to delete a collection</p>
                    <div>
                        <label htmlFor="id">Id to delete</label>
                        <input type="text" id="id" name="id" onChange={handleChange} value={formData.id} />
                    </div>
                    <button>Submit!</button>
                </form>
            </div>
        </div>
    )
}
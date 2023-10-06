import axios from "axios";
import { useState } from "react";

export function TestCollectionAddDVD()
{
    const [formData, setFormData] = useState({ id: "", barcode: "" })

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
        </div>
    )
}
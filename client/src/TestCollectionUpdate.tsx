import axios from "axios";
import { useState } from "react";

export function TestCollectionUpdate()
{
    const [formData, setFormData] = useState({ id: "", barcode: "", modifyType: "add" })

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
        console.log("Barcode to update: ", formData.barcode);
        console.log("Modify type is: ", formData.modifyType);
        const userData =
        {
            barcode: formData.barcode,
            modifyType: formData.modifyType
        }
        axios.patch(`/api/v1/disccollections/${formData.id}`, userData).then((response) =>
        {
            console.log("Patch request received.");
        }).catch((e) =>
        {
            console.log(e);
        })
    }

    return (
        <div>
            <div style={{ backgroundColor: "darkblue" }}>
                <form action="" onSubmit={handleSubmit}>
                    <p>basic form to update a collection</p>
                    <div>
                        <label htmlFor="id">id of collection to modify</label>
                        <input type="text" id="id" name="id" onChange={handleChange} value={formData.id} />
                    </div>
                    <div>
                        <label htmlFor="barcode">barcode to modify</label>
                        <input type="text" id="barcode" name="barcode" onChange={handleChange} value={formData.barcode} />
                    </div>
                    <div>
                        <span>add the barcode, or remove it? </span>
                        <label htmlFor="add">add</label>
                        <input type="radio" name="modifyType" value="add" id="add" onChange={handleChange} defaultChecked />
                        <label htmlFor="remove">remove</label>
                        <input type="radio" name="modifyType" value="remove" id="remove" onChange={handleChange} />
                    </div>
                    <button>Submit!</button>
                </form>
            </div>
        </div>
    )
}
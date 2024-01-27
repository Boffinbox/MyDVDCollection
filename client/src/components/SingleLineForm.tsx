import { StateChangingButton } from "./StateChangingButton"
import { useState } from "react"

export function SingleLineForm(
    {
        submitButtonText,
        labelText,
        toServer,
        toClient
    }: {
        submitButtonText: string,
        labelText: string,
        toServer: (...args: any[]) => void,
        toClient: (...args: any[]) => void
    })
{
    const [formData, setFormData] = useState({ data: "" })

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

    return (
        <>
            <label htmlFor={labelText}>{labelText}</label>
            <input type="text" id={labelText} name="data" onChange={handleChange} value={formData.data} />
            <StateChangingButton
                text={submitButtonText}
                toServer={async () =>
                {
                    await toServer(formData.data)
                }}
                toClient={toClient}
            />
        </>
    )
}
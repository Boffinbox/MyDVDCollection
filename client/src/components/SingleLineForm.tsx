import { StateChangingButton } from "./StateChangingButton"
import { useState } from "react"

import { FormControl, FormLabel, Input } from "@mui/joy"

export function SingleLineForm(
    {
        submitButtonText,
        labelText,
        onSubmit,
    }: {
        submitButtonText: string,
        labelText: string,
        onSubmit: (...args: any[]) => void,
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
            <FormControl>
                <FormLabel id={labelText}>{labelText}</FormLabel>
                <Input type="text" id={labelText} name="data" onChange={handleChange} value={formData.data} />
            </FormControl>
            <StateChangingButton
                text={submitButtonText}
                onSubmit={async () =>
                {
                    await onSubmit(formData.data);
                    setFormData(() => ({ data: "" }))
                }}
            />
        </>
    )
}
import { createFileRoute } from "@tanstack/react-router"

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AccessTokenQueryOptions, CollectionsQueryOptions } from "../../utilities/Queries";

import { Divider, Select, Option, Typography, FormControl, FormLabel, FormHelperText, Stack, Button, Input } from "@mui/joy"
import { useState } from "react";

export const Route = createFileRoute('/_mdc/newform')({
    component: NewForm
})

function NewForm()
{
    const queryClient = useQueryClient();

    const tokenQuery = useQuery(AccessTokenQueryOptions())
    const token: string | undefined = tokenQuery.data;

    const collectionsQuery = useQuery(CollectionsQueryOptions(token))
    const collections: [{ _id: string, title: string }] = collectionsQuery.data;

    const [formData, setFormData] = useState({ barcode: "" })

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

    function handleSubmit(evt: React.ChangeEvent<HTMLFormElement>)
    {
        evt.preventDefault();
        const formData = new FormData(evt.currentTarget);
        const formJson = Object.fromEntries((formData as any).entries());
        console.log("collId: ", formJson.collId, " barcode: ", formJson.barcode);
        setFormData(() => ({ barcode: "" }))
    }

    if (collectionsQuery.isLoading) return <h1>Loading...</h1>
    if (collectionsQuery.isError) return (
        <>
            <div>Oh no! Something went wrong...</div>
            <pre>{JSON.stringify(collectionsQuery.error.message)}</pre>
        </>
    )

    return (
        <>
            <Stack gap={1}>
                <Typography level="h1">Add a Disc</Typography>
                <Divider />
                <form
                    onSubmit={handleSubmit}
                >
                    <Stack gap={3}>
                        <FormControl>
                            <FormLabel>
                                Choose collection to add to:
                            </FormLabel>
                            <Select
                                placeholder="Select a collection"
                                name="collId"
                                required
                            >
                                {collections.map((coll) => (
                                    <Option
                                        key={coll._id}
                                        value={coll._id}
                                    >
                                        {coll.title}</Option>
                                ))}
                            </Select>
                            <FormHelperText>
                                $TODO helper text collId
                            </FormHelperText>
                        </FormControl>
                        <FormControl>
                            <FormLabel>
                                Barcode
                            </FormLabel>
                            <Input
                                placeholder="Type barcode here"
                                name="barcode"
                                required
                                onChange={handleChange}
                                value={formData.barcode}
                            />
                            <FormHelperText>
                                $TODO helper text barcode
                            </FormHelperText>
                        </FormControl>
                        <Button type="submit">Add Disc</Button>
                    </Stack>
                </form>
            </Stack>
        </>
    )

}
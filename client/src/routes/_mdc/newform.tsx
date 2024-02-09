import { createFileRoute } from "@tanstack/react-router"

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AccessTokenQueryOptions, CollectionsQueryOptions } from "../../utilities/Queries";

import { Divider, Select, Option, Typography, FormControl, FormLabel, FormHelperText, Stack, Button } from "@mui/joy"

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

    return (
        <>
            <Typography level="h1">Add a DVD</Typography>
            <Divider />
            <form
                onSubmit={(event) =>
                {
                    event.preventDefault();
                    const formData = new FormData(event.currentTarget);
                    const formJson = Object.fromEntries((formData as any).entries());
                    console.log(formJson.collId);
                }}
            >
                <FormControl>
                    <FormLabel>
                        Choose collection to add to:
                    </FormLabel>
                    <Select
                        placeholder="Select a collection"
                        name="collId"
                        required
                    >
                        <Option value="dog">Dog</Option>
                        <Option value="cat">Cat</Option>
                        <Option value="pp">Fish</Option>
                        <Option value="bird">Bird</Option>
                    </Select>
                    <FormHelperText>
                        This is a helper text.
                    </FormHelperText>
                    <Button type="submit">Submit</Button>
                </FormControl>
            </form>
        </>
    )

}
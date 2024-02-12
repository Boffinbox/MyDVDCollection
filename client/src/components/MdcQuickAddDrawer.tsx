import { Drawer, List, ListItem, Button, FormControl, FormHelperText, FormLabel, Input, Select, Stack, Option, Snackbar } from "@mui/joy"

import { useState } from "react";
import { PostBarcode } from "../httpverbs/PostBarcode";
import { useQuery } from "@tanstack/react-query";
import { AccessTokenQueryOptions, CollectionsQueryOptions } from "../utilities/Queries";

export function MdcQuickAddDrawer({ open, setOpen }: { open: boolean, setOpen: (arg0: boolean) => void })
{
    const tokenQuery = useQuery(AccessTokenQueryOptions())
    const token: string | undefined = tokenQuery.data;

    const collectionsQuery = useQuery(CollectionsQueryOptions(token))
    const collections: [{ _id: string, title: string }] = collectionsQuery.data;

    const [formData, setFormData] = useState({ barcode: "" })

    const [snackBarState, setSnackBarState] = useState({ snackBarText: "", openSnackBar: false })
    const { openSnackBar, snackBarText } = snackBarState

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

    async function handleSubmit(evt: React.ChangeEvent<HTMLFormElement>)
    {
        evt.preventDefault();
        const formData = new FormData(evt.currentTarget);
        const formJson = Object.fromEntries((formData as any).entries());
        console.log("collId: ", formJson.collId, " barcode: ", formJson.barcode);
        try
        {
            await PostBarcode(token, formJson.collId, formJson.barcode)
            setFormData(() => ({ barcode: "" }))
            setSnackBarState(prevData =>
            {
                return {
                    snackBarText: `${formJson.barcode} added to collection ${formJson.collId}`,
                    openSnackBar: true
                }
            })
        }
        catch
        {
            // todo disc no post
        }
    }

    return (
        <>
            <Drawer
                open={open}
                onClose={() => setOpen(false)}
                anchor="bottom"
                size="sm"
                sx={{
                    borderRight: 0
                }}
            >
                <List
                    size="lg"
                    component="nav"
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center"
                    }}
                >
                    <ListItem>Quick Add</ListItem>
                    <ListItem>
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
                                        {collections != undefined ? collections.map((coll) => (
                                            <Option
                                                key={coll._id}
                                                value={coll._id}
                                            >
                                                {coll.title}
                                            </Option>
                                        )) :
                                            <Option value="">...no collections found...</Option>}
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
                    </ListItem>
                </List>
            </Drawer>
            <Snackbar
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                open={openSnackBar}
                color="success"
                onClose={(event, reason) =>
                {
                    setSnackBarState(prevData => { return { ...prevData, open: false } })
                }}
            >
                {snackBarText}
            </Snackbar>
        </>
    )
}
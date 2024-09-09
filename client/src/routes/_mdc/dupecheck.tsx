import { createFileRoute } from "@tanstack/react-router"

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AccessTokenQueryOptions, CollectionsQueryOptions } from "../../utilities/Queries";

import { Divider, Typography, FormControl, FormLabel, FormHelperText, Stack, Button, Input, Snackbar } from "@mui/joy"
import { useState } from "react";

import { BarcodeScanner, DetectedBarcode } from "react-barcode-scanner";
import 'react-barcode-scanner/polyfill'

import { ICollectionHydrated } from "../../Interfaces";

export const Route = createFileRoute('/_mdc/dupecheck')({
    component: NewForm
})

function NewForm()
{
    const queryClient = useQueryClient();

    const tokenQuery = useQuery(AccessTokenQueryOptions())
    const token: string | undefined = tokenQuery.data;

    const collectionsQuery = useQuery(CollectionsQueryOptions(token))
    const collections: ICollectionHydrated[] = collectionsQuery.data;

    const [formData, setFormData] = useState({ barcode: "" })

    const [camera, setCamera] = useState({ isActive: true })

    const [snackBarState, setSnackBarState] = useState({ snackBarText: "", open: false })
    const { open, snackBarText } = snackBarState

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

    function handleCapture(detection: DetectedBarcode)
    {
        setFormData(() => ({ barcode: detection.rawValue }));
        setCamera(() => ({ isActive: false }))
    }

    async function handleSubmit(evt: React.ChangeEvent<HTMLFormElement>)
    {
        evt.preventDefault();
        console.log("barcode to check is: ", formData.barcode);
        const duplicates: string[] = isOwnedBarcode(collections, formData.barcode)
        console.log(duplicates);
        setSnackBarState(prevData =>
        {
            return {
                snackBarText: `This barcode (${formData.barcode}) was found ${duplicates[0]} times`,
                open: true
            }
        })

    }

    function isOwnedBarcode(collections: ICollectionHydrated[], barcode: string): string[]
    {
        let indicies = [];
        for (let i = 0; i < collections.length; i++)
        {
            for (let j = 0; j < collections[i].discs.length; j++)
            {
                if (collections[i].discs[j].referenceDVD.barcode === barcode)
                {
                    indicies.push([i, j]);
                }
            }
        }
        let collIndicies = []
        for (let i = 0; i < indicies.length; i++)
        {
            collIndicies.push(collections[indicies[i][0]].title);
        }
        return [indicies.length.toString(), ...new Set(collIndicies)];
    }

    if (collectionsQuery.isLoading) return <Typography level="h1">Loading...</Typography>
    if (collectionsQuery.isError) return (
        <>
            <div>Oh no! Something went wrong...</div>
            <pre>{JSON.stringify(collectionsQuery.error.message)}</pre>
        </>
    )

    return (
        <>
            <Stack gap={1}>
                <Typography level="h1">Duplicate Checker</Typography>
                <Divider />
                <form
                    onSubmit={handleSubmit}
                >
                    <Stack gap={3}>
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
                        <Button type="submit">Check for duplicate...</Button>
                    </Stack>
                </form>
                {
                    camera.isActive ?
                        <BarcodeScanner
                            options={{ delay: 500, formats: ["ean_13", "ean_8", "upc_a", "upc_e"] }}
                            onCapture={handleCapture}
                        />
                        :
                        <></>
                }
            </Stack>
            <Snackbar
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                open={open}
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
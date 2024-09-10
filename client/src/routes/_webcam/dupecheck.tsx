import { createFileRoute } from "@tanstack/react-router"

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AccessTokenQueryOptions, CollectionsQueryOptions } from "../../utilities/Queries";

import { Typography, Snackbar, Sheet, Button } from "@mui/joy"
import { useState } from "react";

import { BarcodeScanner, DetectedBarcode } from "react-barcode-scanner";
import 'react-barcode-scanner/polyfill'

import { ICollectionHydrated } from "../../Interfaces";

export const Route = createFileRoute('/_webcam/dupecheck')({
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
        // setFormData(() => ({ barcode: detection.rawValue }));
        let barcode = detection.rawValue
        setCamera(() => ({ isActive: false }))
        console.log("barcode to check is: ", barcode);
        const duplicates: string[] = isOwnedBarcode(collections, barcode)
        console.log(duplicates);
        setSnackBarState(prevData =>
        {
            return {
                snackBarText: `This barcode (${barcode}) was found ${duplicates[0]} times`,
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
            <Sheet sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
            }}>
                <Sheet sx={{
                    height: "92dvh",
                    width: "100%",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center"
                }}>
                    {
                        camera.isActive ?
                            <>
                                <BarcodeScanner
                                    options={{ delay: 500, formats: ["ean_13", "ean_8", "upc_a", "upc_e"] }}
                                    onCapture={handleCapture}
                                />
                                <Sheet
                                    sx={{
                                        position: "absolute",
                                        width: "80%",
                                        height: "60%",
                                        borderRadius: "20dvw",
                                        border: "1dvw solid grey",
                                        borderLeft: "1dvw",
                                        borderRight: "1dvw",
                                        backgroundColor: "transparent"
                                    }}
                                >
                                </Sheet>
                                <Sheet
                                    sx={{
                                        position: "absolute",
                                        width: "80%",
                                        height: "59.5%",
                                        borderRadius: "20dvw",
                                        border: "0.8dvw solid dimgrey",
                                        borderLeft: "1dvw",
                                        borderRight: "1dvw",
                                        backgroundColor: "transparent"
                                    }}
                                >
                                </Sheet>
                            </>
                            :
                            <>
                                <Button
                                    sx={{
                                        width: "80dvw",
                                        height: "80%"
                                    }}
                                    onClick={() => { setCamera(() => ({ isActive: true })) }}>
                                </Button>
                            </>
                    }
                </Sheet>
            </Sheet>
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
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

    const [dupeText, setDupeText] = useState({ value: "" })

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
        setDupeText(() => ({ value: generateDupeText(duplicates) }))
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

    function generateDupeText(duplicates: string[]): string
    {
        const amount = duplicates[0];
        let stringToReturn = `This barcode was found ${amount} times, in `
        for (let i = 1; i < duplicates.length; i++)
        {
            stringToReturn += duplicates[i]
        }
        return stringToReturn;
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
                    justifyContent: "center",
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
                                <Sheet sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    mx: "10dvw",
                                    gap: 10
                                }}>
                                    <Typography
                                        level="h3"
                                        textAlign={"center"}
                                    >
                                        {dupeText.value}
                                    </Typography>
                                    <Button
                                        sx={{}}
                                        onClick={() => { setCamera(() => ({ isActive: true })) }}>
                                        <Typography
                                            level="h1"
                                        >
                                            Scan another
                                        </Typography>
                                    </Button>
                                </Sheet>
                            </>
                    }
                </Sheet>
            </Sheet>
        </>
    )

}
import { createFileRoute } from "@tanstack/react-router"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AccessTokenQueryOptions, CollectionsQueryOptions } from "../../utilities/Queries";

import { Typography, Sheet, Button, ButtonGroup } from "@mui/joy"
import { useState } from "react";

import { BarcodeScanner, DetectedBarcode } from "react-barcode-scanner";
import 'react-barcode-scanner/polyfill'

import { ICollectionHydrated, IDisc } from "../../Interfaces";
import { PostBarcode } from "../../httpverbs/PostBarcode";

export const Route = createFileRoute('/_webcam/scanner')({
    component: Scanner
})

function Scanner()
{
    const queryClient = useQueryClient();

    const tokenQuery = useQuery(AccessTokenQueryOptions())
    const token: string | undefined = tokenQuery.data;

    const collectionsQuery = useQuery(CollectionsQueryOptions(token))
    const collections: ICollectionHydrated[] = collectionsQuery.data;

    const [formData, setFormData] = useState({ barcode: "", collectionId: "" })

    const [camera, setCamera] = useState({ isActive: false })
    const [addDisc, setAddDisc] = useState({ isActive: false });

    const [detection, setDetection] = useState({ value: "" })

    const newDiscMutation = useMutation({
        mutationFn: (barcode: string) => PostBarcode(token, formData.collectionId, barcode),
        onSuccess: (returnedDisc: IDisc) =>
        {
            console.log("received data was: ", returnedDisc)
            console.log("coll id is: ", formData.collectionId)
            queryClient.setQueryData(["collection", formData.collectionId],
                (oldData: ICollectionHydrated) =>
                {
                    console.log(oldData)
                    return {
                        ...oldData,
                        discs: [...oldData.discs, returnedDisc]
                    }
                }
            )
        }
    })

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

    async function handleCapture(detection: DetectedBarcode)
    {
        await setFormData(prevData => ({ ...prevData, barcode: detection.rawValue }));
        setCamera(() => ({ isActive: false }))
        console.log("barcode to check is: ", formData.barcode);
        const duplicates: string[] = isOwnedBarcode(collections, formData.barcode)
        console.log(duplicates);
        setDetection(() => ({ value: genText(duplicates) }))
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

    function genText(duplicates: string[]): string
    {
        const amount = duplicates[0];
        let stringToReturn = `This barcode (${formData.barcode}) was found ${amount} times, in `
        if (duplicates.length <= 1) // if no duplicate found
        {
            stringToReturn = `You don't have this item yet! Would you like to add?`
        }
        else
        {
            stringToReturn = `This barcode was found ${amount} times, in `
        }
        for (let i = 1; i < duplicates.length; i++)
        {
            stringToReturn += `${duplicates[i]}, `
        }
        return stringToReturn;
    }

    async function handleSubmit()
    {
        await newDiscMutation.mutate(formData.barcode)
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
                    {camera.isActive ? <>
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
                    </> : <>
                        <Sheet sx={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            alignItems: "center",
                            height: "92dvh",
                            mx: "10dvw"
                        }}>
                            <Sheet sx={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                                flexBasis: "46dvh",
                            }}>
                                pp
                                logo goes here
                                barcode: meh
                            </Sheet>
                            <Sheet sx={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                                flexBasis: "23dvh",
                            }}>
                                <Sheet>
                                    <Typography
                                        level="body-lg"
                                        textAlign={"center"}>
                                        {detection.value}
                                    </Typography>
                                </Sheet>
                            </Sheet>
                            <Sheet sx={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                                flexBasis: "23dvh"
                            }}>
                                <ButtonGroup
                                    buttonFlex={1}
                                    variant="solid"
                                    size="lg"
                                    spacing={1}
                                >
                                    <Button
                                        onClick={() => { setCamera(() => ({ isActive: true })) }}
                                        sx={{ width: "50dvw", height: "10dvh" }}
                                    >
                                        <Typography
                                            level="title-lg"
                                        >Scan again</Typography>
                                    </Button>
                                    <Button
                                        onClick={() => { setAddDisc(() => ({ isActive: true })) }}
                                        color="success"
                                    >
                                        <Typography
                                            level="title-lg"
                                        >Add disc</Typography>
                                    </Button>
                                </ButtonGroup>
                            </Sheet>
                        </Sheet>
                    </>}
                </Sheet>
            </Sheet >
        </>
    )

}
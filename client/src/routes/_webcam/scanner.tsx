import { createFileRoute, useNavigate } from "@tanstack/react-router"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AccessTokenQueryOptions, CollectionsQueryOptions } from "../../utilities/Queries";

import { Typography, Sheet, Button, ButtonGroup, ModalDialog, Modal, ListItem, List, ListItemButton } from "@mui/joy"
import { useState } from "react";

import { BarcodeScanner, DetectedBarcode } from "react-barcode-scanner";
import 'react-barcode-scanner/polyfill'

import { ICollectionHydrated, IDisc } from "../../Interfaces";
import { PostBarcode } from "../../httpverbs/PostBarcode";
import { ScannerFlairs } from "../../components/ScannerFlairs";
import { ScannerCollectionModal } from "../../components/ScannerCollectionModal";
import { ScannerCheckMark } from "../../components/ScannerCheckMark";

export const Route = createFileRoute('/_webcam/scanner')({
    component: Scanner
})

function Scanner()
{
    const queryClient = useQueryClient();

    const navigate = useNavigate();

    const tokenQuery = useQuery(AccessTokenQueryOptions())
    const token: string | undefined = tokenQuery.data;

    const collectionsQuery = useQuery(CollectionsQueryOptions(token))
    const collections: ICollectionHydrated[] = collectionsQuery.data;

    const [formData, setFormData] = useState({ barcode: "", collectionId: "" })

    const [camera, setCamera] = useState({ isActive: false })
    const [isCaptured, setisCaptured] = useState(false);

    const [genString, setGenString] = useState({ value: "" })

    const [openModal, setOpenModal] = useState<boolean>(false);

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

    async function handleCapture(detection: DetectedBarcode)
    {
        await setFormData(prevData => ({ ...prevData, barcode: detection.rawValue }));
        setCamera(() => ({ isActive: false }))
        setisCaptured(() => (true))
        console.log("barcode to check is: ", formData.barcode);
        const duplicates: string[] = isOwnedBarcode(collections, formData.barcode)
        console.log(duplicates);
        setGenString(() => ({ value: genText(duplicates) }))
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
        let stringToReturn = `This barcode (${formData.barcode}) was found ${amount} time`
        if (duplicates.length == 1) // barcode not found
        {
            stringToReturn = `You don't have this item yet! Would you like to add?`
        }
        else if (duplicates.length == 2) // singular check, time vs times
        {
            stringToReturn += `, in ${duplicates[1]}.`
        }
        else
        {
            stringToReturn += `s, in `;
            for (let i = 1; i < duplicates.length; i++)
            {
                if (i == duplicates.length - 1) // if we're at the last duplicate
                {
                    stringToReturn += `and ${duplicates[i]}.`
                }
                else
                {
                    stringToReturn += `${duplicates[i]}, `
                }
            }
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
                height: "92dvh",
                width: "100%",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center"
            }}>
                {camera.isActive ? <>
                    <BarcodeScanner
                        options={{ delay: 500, formats: ["ean_13", "ean_8", "upc_a", "upc_e"] }}
                        onCapture={handleCapture}
                    />
                    <ScannerFlairs />
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
                            {isCaptured ?
                                <>
                                    symbol logic here
                                </> : <>
                                    initial decision screen
                                    <Sheet sx={{ height: "40dvh" }}>
                                        <ScannerCheckMark />
                                    </Sheet>
                                </>
                            }
                        </Sheet>
                        <Sheet sx={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            flexBasis: "23dvh",
                        }}>
                            {isCaptured ?
                                <>
                                    <Sheet>
                                        <Typography
                                            level="body-lg"
                                            textAlign={"center"}>
                                            {genString.value}
                                        </Typography>
                                    </Sheet>
                                </> : <>
                                    <Sheet>
                                        <Typography
                                            level="body-lg"
                                            textAlign={"center"}>
                                        </Typography>
                                        <Button variant="outlined" color="neutral" onClick={() => setOpenModal(true)}>
                                            {
                                                !formData.collectionId ?
                                                    <>
                                                        Choose a collection
                                                    </>
                                                    :
                                                    <>
                                                        Selected: {collections.find((e) => e._id == formData.collectionId)!.title}
                                                    </>
                                            }
                                        </Button>
                                    </Sheet>
                                </>
                            }
                        </Sheet>
                        <Sheet sx={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            flexBasis: "23dvh"
                        }}>
                            {isCaptured ?
                                <>
                                    <ButtonGroup
                                        buttonFlex={1}
                                        variant="solid"
                                        size="lg"
                                        spacing={1}
                                    >
                                        <Button
                                            onClick={async () => 
                                            {
                                                if (formData.collectionId == "")
                                                {
                                                    setOpenModal(true)
                                                }
                                                else
                                                {
                                                    await newDiscMutation.mutate(formData.barcode)
                                                    setisCaptured(() => false)
                                                }
                                            }}
                                            color="success"
                                            sx={{ minWidth: "30dvw", height: "10dvh" }}
                                        >
                                            Add to a collection
                                        </Button>
                                        <Button
                                            onClick={() =>
                                            {
                                                setCamera(() => ({ isActive: true }))
                                                setisCaptured(() => false)
                                            }}
                                            sx={{ minWidth: "30dvw", height: "10dvh" }}
                                        >
                                            Re-scan
                                        </Button>
                                    </ButtonGroup>
                                </> : <>
                                    <ButtonGroup
                                        buttonFlex={1}
                                        variant="solid"
                                        size="lg"
                                        spacing={1}
                                    >
                                        <Button
                                            onClick={() =>
                                            {
                                                setCamera(() => ({ isActive: true }))
                                                setisCaptured(() => false)
                                            }}
                                            sx={{ minWidth: "30dvw", height: "10dvh" }}
                                            color="primary"
                                        >
                                            Start scanning!
                                        </Button>
                                    </ButtonGroup>
                                </>
                            }
                        </Sheet>
                    </Sheet>
                </>}
            </Sheet >
            <ScannerCollectionModal
                isModalOpen={openModal}
                closeModal={() => setOpenModal(false)}
                collections={collections}
                setFormData={setFormData}
            />
        </>
    )
}
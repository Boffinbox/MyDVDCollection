import { createFileRoute, useNavigate } from "@tanstack/react-router"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AccessTokenQueryOptions, CollectionsQueryOptions } from "../../utilities/Queries";

import { Typography, Sheet, Button, ButtonGroup, ModalDialog, Modal, ListItem, List, ListItemButton } from "@mui/joy"
import { useState } from "react";

import { BarcodeScanner, DetectedBarcode } from "react-barcode-scanner";
import 'react-barcode-scanner/polyfill'

import { ICollectionHydrated, IDisc } from "../../Interfaces";
import { PostBarcode } from "../../httpverbs/PostBarcode";
import { ScannerFlairs } from "../../components/scanner/ScannerFlairs";
import { ScannerCollectionModal } from "../../components/scanner/ScannerCollectionModal";
import { ScannerCheckMark } from "../../components/scanner/ScannerCheckMark";
import { ScannerQuestionMark } from "../../components/scanner/ScannerQuestionMark";
import { ScannerExclamationMark } from "../../components/scanner/ScannerExclamationMark";
import { ScannerCrossMark } from "../../components/scanner/ScannerCrossMark";
import { ScannerCheckMarkA } from "../../components/scanner/ScannerCheckMarkA";

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
    const [isCaptured, setIsCaptured] = useState(false);
    const [isOwnedBarcode, setIsOwnedBarcode] = useState(true);

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
        const barcode = detection.rawValue
        setFormData(prevData => ({ ...prevData, barcode }));
        console.log("barcode to check is: ", barcode);
        const owned = isOwned(collections, barcode)
        setIsOwnedBarcode(owned)
        console.log("is this barcode owned? : " + owned)
        let text = genText(collections, barcode, owned)
        console.log("generated text is: " + text)
        setGenString(() => ({ value: text }))
        setIsCaptured(() => (true))
        setCamera(() => ({ isActive: false }))
    }

    function isOwned(collections: ICollectionHydrated[], barcode: string): boolean
    {
        for (let i = 0; i < collections.length; i++)
        {
            for (let j = 0; j < collections[i].discs.length; j++)
            {
                if (collections[i].discs[j].referenceDVD.barcode === barcode)
                {
                    return true
                }
            }
        }
        return false
    }

    function genText(collections: ICollectionHydrated[], barcode: string, isOwnedBarcode: boolean): string
    {
        if (isOwnedBarcode === false)
        {
            return `You don't have this item yet! Would you like to add?`
        }
        let indicies = []
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
        let amount = indicies.length
        let stringToReturn = `This barcode (${barcode}) was found ${amount} time`
        return stringToReturn
        // let collIndicies = []
        // for (let i = 0; i < indicies.length; i++)
        // {
        //     collIndicies.push(collections[indicies[i][0]].title);
        // }
        // else if (amount >= 1) // singular check, time vs times
        // {
        //     stringToReturn += `, in ${duplicates[1]}.`
        // }
        // else
        // {
        //     stringToReturn += `s, in `;
        //     for (let i = 1; i < duplicates.length; i++)
        //     {
        //         if (i == duplicates.length - 1) // if we're at the last duplicate
        //         {
        //             stringToReturn += `and ${duplicates[i]}.`
        //         }
        //         else
        //         {
        //             stringToReturn += `${duplicates[i]}, `
        //         }
        //     }
        // }
        // return stringToReturn;
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
                        {`barcode is: ${formData.barcode}`},
                        {`isOwnedBarcode is: ${isOwnedBarcode}`}
                        <Sheet sx={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            flexBasis: "46dvh"
                        }}>
                            <Sheet sx={{ height: "40dvh", my: "6dvh" }}>
                                {isCaptured ?
                                    // actual scanner logic
                                    <>
                                        {(isOwnedBarcode) ?
                                            // if a duplicate
                                            <>
                                                <ScannerCheckMark />
                                            </> :
                                            // if not a duplicate
                                            <>
                                                <ScannerExclamationMark />
                                            </>
                                        }

                                    </> :
                                    // pre scanner logic
                                    <>
                                        <ScannerQuestionMark />
                                    </>
                                }
                            </Sheet>
                        </Sheet>
                        <Sheet sx={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            flexBasis: "13dvh",
                        }}>
                            <Sheet>
                                <Typography
                                    level="body-lg"
                                    textAlign={"center"}>
                                    {isCaptured ?
                                        <>{genString.value}
                                        </> : <>
                                            {!formData.collectionId ?
                                                <>
                                                    Choose a collection to scan against, or press "Scan all collections!" to check across all collections.
                                                </> : <>
                                                    You have selected: {collections.find((e) => e._id == formData.collectionId)!.title}
                                                </>
                                            }

                                        </>
                                    }
                                </Typography>
                            </Sheet>

                        </Sheet>
                        <Sheet sx={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            flexBasis: "33dvh"
                        }}>
                            <ButtonGroup
                                buttonFlex={1}
                                variant="solid"
                                size="lg"
                                spacing={1}
                            >
                                {isCaptured ?
                                    <>
                                        {/* if after scan */}
                                        <Button
                                            onClick={async () => 
                                            {
                                                if (formData.collectionId == "")
                                                {
                                                    setOpenModal(() => true)
                                                }
                                                else
                                                {
                                                    await newDiscMutation.mutate(formData.barcode)
                                                    setIsCaptured(() => false)
                                                }
                                            }}
                                            color="success"
                                            sx={{ minWidth: "30dvw", height: "15dvh" }}
                                        >
                                            Add to a collection
                                        </Button>
                                        <Button
                                            onClick={() =>
                                            {
                                                setCamera(() => ({ isActive: true }))
                                                setIsCaptured(() => false)
                                            }}
                                            sx={{ minWidth: "30dvw", height: "15dvh" }}
                                        >
                                            Re-scan
                                        </Button>
                                    </> : <>
                                        {/* if before scan */}
                                        <Button
                                            onClick={() => setOpenModal(() => true)}
                                            color="success"
                                            sx={{ minWidth: "30dvw", height: "15dvh" }}
                                        >
                                            {!formData.collectionId ?
                                                <>
                                                    Choose a collection
                                                </> : <>
                                                    Re-select collection
                                                </>
                                            }
                                        </Button>
                                        <Button
                                            onClick={() =>
                                            {
                                                setCamera(() => ({ isActive: true }))
                                                setIsCaptured(() => false)
                                            }}
                                            sx={{ minWidth: "30dvw", height: "15dvh" }}
                                            color="primary"
                                        >
                                            {!formData.collectionId ?
                                                <>
                                                    Scan all collections!
                                                </> : <>
                                                    Scan your {collections.find((e) => e._id == formData.collectionId)!.title} collection!
                                                </>
                                            }
                                        </Button>
                                    </>}
                            </ButtonGroup>
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
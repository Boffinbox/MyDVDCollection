import { createFileRoute } from "@tanstack/react-router"

import { useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { AccessTokenQueryOptions, BarcodesQueryOptions, CollectionQueryOptions, CollectionsQueryOptions } from "../../utilities/Queries";

import { Typography, Sheet, Button, ButtonGroup } from "@mui/joy"
import { useState } from "react";

import { BarcodeScanner, DetectedBarcode } from "react-barcode-scanner";
import 'react-barcode-scanner/polyfill'

import { IBarcodes, ICollection, IReferenceDisc } from "../../Interfaces";
import { PostBarcode } from "../../httpverbs/PostBarcode";
import { ScannerFlairs } from "../../components/scanner/ScannerFlairs";
import { ScannerCollectionModal } from "../../components/scanner/ScannerCollectionModal";
import { ScannerCheckMark } from "../../components/scanner/ScannerCheckMark";
import { ScannerQuestionMark } from "../../components/scanner/ScannerQuestionMark";
import { ScannerExclamationMark } from "../../components/scanner/ScannerExclamationMark";
import { ScannerCrossMark } from "../../components/scanner/ScannerCrossMark";
import { ScannerCheckMarkA } from "../../components/scanner/ScannerCheckMarkA";
import { ArrowDropDown } from "@mui/icons-material";
import { ScannerCameraMark } from "../../components/scanner/ScannerCameraMark";

export const Route = createFileRoute('/_webcam/scanner')({
    component: Scanner
})

function Scanner()
{
    const queryClient = useQueryClient();

    const tokenQuery = useQuery(AccessTokenQueryOptions())
    const token: string | undefined = tokenQuery.data;

    const collectionListQuery = useQuery(CollectionsQueryOptions(token))
    const collectionList: string[] = collectionListQuery.data;

    const collectionsQueries = useQueries({
        queries: collectionList.map((id) => (CollectionQueryOptions(token, id)))
    })

    const collections: ICollection[] = collectionsQueries.map((query) => query.data)

    const barcodesQuery = useQuery(BarcodesQueryOptions(token))
    const barcodes: IBarcodes = barcodesQuery.data

    const [formData, setFormData] = useState({ barcode: "", collectionId: "" })

    const [camera, setCamera] = useState({ isActive: false })
    const [isCaptured, setIsCaptured] = useState(false);
    const [isOwnedBarcode, setIsOwnedBarcode] = useState(true);
    const [isAddAttempt, setIsAddAttempt] = useState(false);

    const [isError, setIsError] = useState(false);
    const [isUnknown, setIsUnknown] = useState(false);

    const [genString, setGenString] = useState({ value: "" })

    const [openModal, setOpenModal] = useState<boolean>(false);

    const newDiscMutation = useMutation({
        mutationFn: (discId: string) => PostBarcode(token, formData.collectionId, discId),
        onSuccess: (returnedDisc: {
            _id: string;
            rating: number;
            watched: boolean;
            referenceDVD: IReferenceDisc
        }) =>
        {
            queryClient.setQueryData(['collection', formData.collectionId],
                (oldData: ICollection) =>
                {
                    oldData.discs.push(returnedDisc._id)
                    setIsAddAttempt(true)
                    if (returnedDisc.referenceDVD.title == "unknown")
                    {
                        setIsUnknown(true)
                        setGenString(() => ({ value: "Added to your collection, but this disc is not in our database. Set it aside and update the name later!" }))
                    }
                    else
                    {
                        setGenString(() => ({ value: "Added successfully!" }))
                    }
                    return oldData
                })
            queryClient.setQueryData(["barcodes"],
                (oldData: IBarcodes) =>
                {
                    if (oldData[formData.barcode] == null)
                    {
                        oldData[formData.barcode] =
                        {
                            count: 0,
                            collArray: []
                        }
                    }
                    let count = oldData[formData.barcode].count
                    count++
                    let collArray = oldData[formData.barcode].collArray
                    if (collArray.indexOf(formData.collectionId) == -1)
                    {
                        collArray.push(formData.collectionId)
                    }
                    oldData[formData.barcode].count = count
                    oldData[formData.barcode].collArray = collArray
                    return oldData
                }
            )
        },
        onError: () => 
        {
            setIsAddAttempt(true)
            setIsError(true);
            setGenString(() => ({ value: "Oh no! Something went wrong 🙁 Please scan again." }))
            return
        }
    })

    function handleCapture(detection: DetectedBarcode)
    {
        const barcode = detection.rawValue
        setFormData(prevData => ({ ...prevData, barcode }));
        setIsCaptured(() => (true))
        setCamera(() => ({ isActive: false }))
        handleDataChange(formData.collectionId, barcode)
    }

    function handleCollChange(collectionId: string)
    {
        let barcode = formData.barcode
        handleDataChange(collectionId, barcode)
    }

    function handleDataChange(collectionId: string, barcode: string)
    {
        console.log("barcode to check is: ", barcode);
        let owned = isOwned(barcode)
        let coll: ICollection | undefined = collections.find(coll => coll._id === collectionId)
        setIsOwnedBarcode(owned)
        console.log("is this barcode owned? : " + owned)
        let text = genText(coll, barcode, owned)
        console.log("generated text is: " + text)
        setGenString(() => ({ value: text }))
    }

    function isOwned(barcode: string): boolean
    {
        if (barcodes[barcode]) return true
        return false
    }

    function genText(coll: ICollection | undefined = undefined, barcode: string, isOwnedBarcode: boolean): string
    {
        if (isOwnedBarcode === false)
        {
            if (coll === undefined)
            {
                return `You don't have this item yet! Would you like to add?`
            }
            else
            {
                return `You don't have this item in your ${coll.title} collection yet! Would you like to add?`
            }
        }
        let titles = []
        let discCount = barcodes[barcode].count;
        let collCount = barcodes[barcode].collArray.length
        for (let collId of barcodes[barcode].collArray)
        {
            let coll: ICollection | undefined = queryClient.getQueryData(["collection", collId])!
            titles.push(coll.title)
        }
        let stringToReturn = `Barcode [${barcode}] was found ${discCount} time`
        if (discCount == 1)
        {
            stringToReturn += ` `
        }
        else
        {
            stringToReturn += `s `
        }
        if (collCount == 1) // singular check, time vs times
        {
            stringToReturn += `in your [${titles[0]}] collection.`
        }
        else
        {
            stringToReturn += `across ${collCount} collections: in `;
            for (let i = 0; i < titles.length; i++)
            {
                if (i == titles.length - 1) // if we're at the last duplicate
                {
                    stringToReturn += `and in [${titles[i]}].`
                }
                else
                {
                    stringToReturn += `[${titles[i]}], `
                }
            }
        }
        return stringToReturn;
    }

    if (collectionListQuery.isLoading) return <Typography level="h1">Loading...</Typography>
    if (collectionListQuery.isError) return (
        <>
            <div>Oh no! Something went wrong...</div>
            <pre>{JSON.stringify(collectionListQuery.error.message)}</pre>
        </>
    )

    if (barcodesQuery.isLoading) return <Typography level="h1">Loading...</Typography>
    if (barcodesQuery.isError) return (
        <>
            <div>Oh no! Something went wrong...</div>
            <pre>{JSON.stringify(barcodesQuery.error.message)}</pre>
        </>
    )

    for (let query of collectionsQueries)
    {
        if (query.isLoading) return <Typography level="h1" sx={{ height: "100%" }}>Loading...</Typography>
        if (query.isError) return (
            <>
                <div>Oh no! Something went wrong...</div>
                <pre>{JSON.stringify(query.error.message)}</pre>
            </>
        )
    }

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
                            flexBasis: "46dvh"
                        }}>
                            <Sheet sx={{ height: "40dvh", my: "6dvh" }}>
                                {isCaptured ?
                                    // actual scanner logic
                                    <>
                                        {(isAddAttempt) ?
                                            // if add attempt made
                                            <>
                                                {(isError) ?
                                                    // if something went wrong...
                                                    <>
                                                        <ScannerCrossMark />
                                                    </> :
                                                    // if all good
                                                    <>
                                                        {(isUnknown) ?
                                                            // if unknown
                                                            <>
                                                                <ScannerQuestionMark />
                                                            </> :
                                                            // if not unknown (i.e, full success)
                                                            <>
                                                                <ScannerCheckMarkA />
                                                            </>
                                                        }
                                                    </>
                                                }
                                            </> :
                                            // if not yet added
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
                                            </>
                                        }
                                    </> :
                                    // pre scanner logic
                                    <>
                                        <ScannerCameraMark />
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
                            width: {
                                xs: "80dvw",
                                md: 720
                            }
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
                                                    You have selected your<> </>
                                                    <Typography color="warning" variant="solid">
                                                        {collections.find((e) => e._id == formData.collectionId)!.title}
                                                    </Typography>
                                                    <> </>collection.
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
                            <Sheet sx={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-evenly",
                                alignItems: "center",
                                width: {
                                    xs: "100dvw",
                                    md: 900
                                }
                            }}>
                                {isCaptured ?
                                    <>
                                        {/* if after scan */}
                                        {isAddAttempt ?
                                            <>
                                                <ButtonGroup
                                                    variant="solid"
                                                    sx={{ width: "40%" }}
                                                >
                                                    <Button
                                                        color="success"
                                                        sx={{ width: "20%", height: "12dvh" }}
                                                        disabled
                                                    >
                                                        <ArrowDropDown />
                                                    </Button>
                                                    <Button
                                                        color="success"
                                                        sx={{ width: "80%", height: "12dvh" }}
                                                        disabled
                                                    >
                                                        {!formData.collectionId ?
                                                            <>
                                                                Add to a collection
                                                            </> : <>
                                                                Add to your {collections.find((e) => e._id == formData.collectionId)!.title} collection!
                                                            </>
                                                        }
                                                    </Button>
                                                </ButtonGroup>
                                            </>
                                            :
                                            <>
                                                <ButtonGroup
                                                    variant="solid"
                                                    sx={{ width: "40%" }}
                                                >
                                                    <Button
                                                        onClick={async () => 
                                                        {
                                                            setOpenModal(() => true)
                                                        }}
                                                        color="success"
                                                        sx={{ width: "20%", height: "12dvh" }}
                                                    >
                                                        <ArrowDropDown />
                                                    </Button>
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
                                                                // setIsCaptured(() => false)
                                                            }
                                                        }}
                                                        color="success"
                                                        sx={{ width: "80%", height: "12dvh" }}
                                                    >
                                                        {!formData.collectionId ?
                                                            <>
                                                                Add to a collection
                                                            </> : <>
                                                                Add to your {collections.find((e) => e._id == formData.collectionId)!.title} collection!
                                                            </>
                                                        }
                                                    </Button>
                                                </ButtonGroup>
                                            </>
                                        }
                                        <Button
                                            onClick={() =>
                                            {
                                                setIsCaptured(() => false)
                                                setIsError(false)
                                                setIsUnknown(false)
                                                setIsAddAttempt(false)
                                            }}
                                            sx={{ width: "40%", height: "12dvh" }}
                                        >
                                            Re-scan
                                        </Button>
                                    </> : <>
                                        {/* if before scan */}
                                        <ButtonGroup
                                            variant="solid"
                                            sx={{ width: "40%" }}
                                        >
                                            <Button
                                                onClick={() => setOpenModal(() => true)}
                                                color="success"
                                                sx={{ width: "20%", height: "12dvh" }}
                                            >
                                                <ArrowDropDown />
                                            </Button>
                                            <Button
                                                onClick={() => setOpenModal(() => true)}
                                                color="success"
                                                sx={{ width: "80%", height: "12dvh" }}
                                            >
                                                {!formData.collectionId ?
                                                    <>
                                                        Choose a collection
                                                    </> : <>
                                                        Re-select collection
                                                    </>
                                                }
                                            </Button>
                                        </ButtonGroup>
                                        <Button
                                            onClick={() =>
                                            {
                                                setCamera(() => ({ isActive: true }))
                                                setIsCaptured(() => false)
                                            }}
                                            sx={{ width: "40%", height: "12dvh" }}
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
                            </Sheet>
                        </Sheet>
                    </Sheet>
                </>}
            </Sheet >
            <ScannerCollectionModal
                isModalOpen={openModal}
                closeModal={() => setOpenModal(false)}
                collections={collections}
                setFormData={setFormData}
                handleCollChange={handleCollChange}
            />
        </>
    )
}
import { createFileRoute, useNavigate } from "@tanstack/react-router"

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AccessTokenQueryOptions, CollectionsQueryOptions } from "../../utilities/Queries";

import { Typography, Sheet, Button, ButtonGroup, ModalDialog, Modal, ListItem, List, ListItemButton } from "@mui/joy"
import { useState } from "react";

import { BarcodeScanner, DetectedBarcode } from "react-barcode-scanner";
import 'react-barcode-scanner/polyfill'

import { ICollectionHydrated } from "../../Interfaces";

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
                    <Sheet
                        sx={{
                            position: "absolute",
                            width: "80%",
                            height: "50%",
                            borderRadius: "15dvw",
                            border: "0.5dvh solid grey",
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
                            height: "49.4%",
                            borderRadius: "15dvw",
                            border: "0.5dvh solid dimgrey",
                            borderLeft: "1dvw",
                            borderRight: "1dvw",
                            backgroundColor: "transparent"
                        }}
                    >
                    </Sheet>
                </> : <>
                    <Modal
                        open={openModal}
                        onClose={() => setOpenModal(false)}
                        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                    >
                        <ModalDialog
                            variant="outlined"
                            sx={{ maxWidth: 500, borderRadius: 'md', p: 3, boxShadow: 'lg' }}
                        >
                            <Typography
                                component="h2"
                                level="h4"
                                textColor="inherit"
                                sx={{ fontWeight: 'lg', mb: 1 }}
                            >
                                Pick a collection
                            </Typography>
                            <List
                                sx={[
                                    {
                                        mx: 'calc(-1 * var(--ModalDialog-padding))',
                                        px: 'var(--ModalDialog-padding)',
                                        overflow: 'scroll'
                                    }
                                ]}
                            >
                                {collections.map((item, index) => (
                                    <ListItem key={index}>
                                        <ListItemButton
                                            variant="outlined"
                                            // onClick={() => navigate({ to: "/scanner/$collectionId", params: { collectionId: item._id } })}
                                            onClick={() =>
                                            {
                                                setFormData(currentData =>
                                                {
                                                    return {
                                                        ...currentData,
                                                        collectionId: item._id.toString()
                                                    };
                                                })
                                                setOpenModal(false)
                                                console.log(`formdata is: ${formData.collectionId}`)
                                                // setCamera({ isActive: true })
                                            }}
                                        >
                                            {item.title}
                                        </ListItemButton>
                                    </ListItem>
                                ))}
                            </List>
                        </ModalDialog>
                    </Modal>
                    {isCaptured ? <>
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
                                successful detection with id of: {formData.collectionId}
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
                                        {genString.value}
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
                                        onClick={() => 
                                        {
                                            if (formData.collectionId == "")
                                            {
                                                setOpenModal(true)
                                            }
                                            else
                                            {
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
                            </Sheet>
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
                                initial decision screen
                                <Button variant="outlined" color="neutral" onClick={() => console.log(formData.collectionId)}>
                                    current collId is {formData.collectionId}
                                </Button>
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
                                    </Typography>
                                    <Button variant="outlined" color="neutral" onClick={() => setOpenModal(true)}>
                                        Choose a collection
                                    </Button>
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
                                        onClick={() =>
                                        {
                                            setCamera(() => ({ isActive: true }))
                                            setisCaptured(() => false)
                                        }}
                                        sx={{ minWidth: "30dvw", height: "10dvh" }}
                                        color="primary"
                                    >
                                        Check across all collections
                                    </Button>
                                </ButtonGroup>
                            </Sheet>
                        </Sheet>
                    </>}
                </>}
            </Sheet >
        </>
    )

}
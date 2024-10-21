import { createFileRoute } from '@tanstack/react-router'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import
{
    AccessTokenQueryOptions,
    CollectionQueryOptions,
} from '../../utilities/Queries'

import { Typography, Sheet, Button, ButtonGroup } from '@mui/joy'
import { useState } from 'react'

import { BarcodeScanner, DetectedBarcode } from 'react-barcode-scanner'
import 'react-barcode-scanner/polyfill'

import { ICollectionHydrated, IDisc } from '../../Interfaces'
import { PostBarcode } from '../../httpverbs/PostBarcode'

export const Route = createFileRoute('/_webcam/scanner/$collectionId')({
    component: ScannerIndividualCollection,
})

function ScannerIndividualCollection()
{
    const { collectionId } = Route.useParams()

    const queryClient = useQueryClient()

    const tokenQuery = useQuery(AccessTokenQueryOptions())
    const token: string | undefined = tokenQuery.data

    const collectionQuery = useQuery(CollectionQueryOptions(token, collectionId))
    const collection: ICollectionHydrated = collectionQuery.data;

    const [formData, setFormData] = useState({ barcode: '' })

    const [camera, setCamera] = useState({ isActive: true })
    const [isCaptured, setisCaptured] = useState(false)

    const [genString, setGenString] = useState({ value: '' })

    const newDiscMutation = useMutation({
        mutationFn: (barcode: string) => PostBarcode(token, collectionId, barcode),
        onSuccess: (returnedDisc: IDisc) =>
        {
            console.log("received data was: ", returnedDisc)
            console.log("coll id is: ", collectionId)
            queryClient.setQueryData(["collection", collectionId],
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
        await setFormData((prevData) => ({
            ...prevData,
            barcode: detection.rawValue,
        }))
        setCamera(() => ({ isActive: false }))
        setisCaptured(() => true)
        console.log('barcode to check is: ', formData.barcode)
        const duplicates: string[] = isOwnedBarcode(collection, formData.barcode)
        console.log(duplicates)
        setGenString(() => ({ value: genText(duplicates) }))
    }

    function isOwnedBarcode(
        collection: ICollectionHydrated,
        barcode: string,
    ): string[]
    {
        let indicies = []
        for (let j = 0; j < collection.discs.length; j++)
        {
            if (collection.discs[j].referenceDVD.barcode === barcode)
            {
                indicies.push([j])
            }
        }
        let collIndicies = []
        for (let i = 0; i < indicies.length; i++)
        {
            collIndicies.push(collection.title)
        }
        return [indicies.length.toString(), ...new Set(collIndicies)]
    }

    function genText(duplicates: string[]): string
    {
        const amount = duplicates[0]
        let stringToReturn = `This barcode (${formData.barcode}) was found ${amount} time`
        if (duplicates.length == 1)
        {
            // barcode not found
            stringToReturn = `Item not found in this collection. Would you like to add?`
        } else if (amount === "1")
        {
            // singular check, time vs times
            stringToReturn += ` in ${duplicates[1]}.`
        } else
        {
            stringToReturn += `s in ${duplicates[1]}.`
        }
        return stringToReturn
    }

    if (collectionQuery.isLoading)
        return <Typography level="h1">Loading...</Typography>
    if (collectionQuery.isError)
        return (
            <>
                <div>Oh no! Something went wrong...</div>
                <pre>{JSON.stringify(collectionQuery.error.message)}</pre>
            </>
        )

    return (
        <>
            <Sheet
                sx={{
                    height: '92dvh',
                    width: '100%',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                {camera.isActive ? (
                    <>
                        <BarcodeScanner
                            options={{
                                delay: 500,
                                formats: ['ean_13', 'ean_8', 'upc_a', 'upc_e'],
                            }}
                            onCapture={handleCapture}
                        />
                        <Sheet
                            sx={{
                                position: 'absolute',
                                width: '80%',
                                height: '50%',
                                borderRadius: '15dvw',
                                border: '0.5dvh solid grey',
                                borderLeft: '1dvw',
                                borderRight: '1dvw',
                                backgroundColor: 'transparent',
                            }}
                        ></Sheet>
                        <Sheet
                            sx={{
                                position: 'absolute',
                                width: '80%',
                                height: '49.4%',
                                borderRadius: '15dvw',
                                border: '0.5dvh solid dimgrey',
                                borderLeft: '1dvw',
                                borderRight: '1dvw',
                                backgroundColor: 'transparent',
                            }}
                        ></Sheet>
                    </>
                ) : (
                    <>
                        {isCaptured ? (
                            <>
                                <Sheet
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        height: '92dvh',
                                        mx: '10dvw',
                                    }}
                                >
                                    <Sheet
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            flexBasis: '46dvh',
                                        }}
                                    >
                                        successful detection
                                    </Sheet>
                                    <Sheet
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            flexBasis: '23dvh',
                                        }}
                                    >
                                        <Sheet>
                                            <Typography level="body-lg" textAlign={'center'}>
                                                {genString.value}
                                            </Typography>
                                        </Sheet>
                                    </Sheet>
                                    <Sheet
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            flexBasis: '23dvh',
                                        }}
                                    >
                                        <ButtonGroup
                                            buttonFlex={1}
                                            variant="solid"
                                            size="lg"
                                            spacing={1}
                                        >
                                            <Button
                                                onClick={async () => 
                                                {
                                                    await newDiscMutation.mutate(formData.barcode)
                                                    setisCaptured(() => false)
                                                }}
                                                color="success"
                                                sx={{ minWidth: '30dvw', height: '10dvh' }}
                                            >
                                                Add to this collection
                                            </Button>
                                            <Button
                                                onClick={() =>
                                                {
                                                    setCamera(() => ({ isActive: true }))
                                                    setisCaptured(() => false)
                                                }}
                                                sx={{ minWidth: '30dvw', height: '10dvh' }}
                                            >
                                                Re-scan
                                            </Button>
                                        </ButtonGroup>
                                    </Sheet>
                                </Sheet>
                            </>
                        ) : (
                            <>
                                <Sheet
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        height: '92dvh',
                                        mx: '10dvw',
                                    }}
                                >
                                    <Sheet
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            flexBasis: '46dvh',
                                        }}
                                    >
                                        {collection.title} decision screen
                                    </Sheet>
                                    <Sheet
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            flexBasis: '23dvh',
                                        }}
                                    >
                                        <Sheet>
                                            <Typography level="body-lg" textAlign={'center'}>
                                                Click below to scan {collection.title} collection!
                                            </Typography>
                                        </Sheet>
                                    </Sheet>
                                    <Sheet
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            flexBasis: '23dvh',
                                        }}
                                    >
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
                                                sx={{ minWidth: '60dvw', height: '10dvh' }}
                                                color="primary"
                                            >
                                                Scan {collection.title} collection
                                            </Button>
                                        </ButtonGroup>
                                    </Sheet>
                                </Sheet>
                            </>
                        )}
                    </>
                )}
            </Sheet>
        </>
    )
}

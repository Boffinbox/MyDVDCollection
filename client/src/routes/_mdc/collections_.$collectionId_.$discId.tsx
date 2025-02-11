import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { DeleteDisc } from '../../httpverbs/DeleteDisc'
import { PostBarcode } from '../../httpverbs/PostBarcode'
import { PostReference } from '../../httpverbs/PostReference'
import { SingleLineForm } from '../../components/SingleLineForm'
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query'
import
    {
        AccessTokenQueryOptions,
        CollectionsQueryOptions,
    } from '../../utilities/Queries'
import { ICollectionHydrated, IDisc, IReferenceDisc } from '../../Interfaces'
import
    {
        AspectRatio,
        Button,
        Divider,
        List,
        Sheet,
        Stack,
        Table,
        Typography,
    } from '@mui/joy'

export const Route = createFileRoute(
    '/_mdc/collections_/$collectionId_/$discId',
)({
    component: Disc,
})

function Disc()
{
    const { collectionId, discId } = Route.useParams()

    const queryClient = useQueryClient()

    const navigate = useNavigate()

    const tokenQuery = useQuery(AccessTokenQueryOptions())
    const token: string | undefined = tokenQuery.data

    const collectionsQuery = useQuery(CollectionsQueryOptions(token))
    const collections: ICollectionHydrated[] = collectionsQuery.data
    const collection: ICollectionHydrated = collections.find(
        (coll) => coll._id === collectionId,
    )!
    const disc: IDisc = collection.discs.find((disc) => disc._id === discId)!
    const refDisc: IReferenceDisc = disc.referenceDVD

    if (collectionsQuery.isLoading)
        return (
            <Typography level="h1" sx={{ height: '100%' }}>
                Loading...
            </Typography>
        )
    if (collectionsQuery.isError)
        return (
            <>
                <div>Oh no! Something went wrong...</div>
                <pre>{JSON.stringify(collectionsQuery.error.message)}</pre>
            </>
        )

    return (
        <>
            <Stack gap={1} sx={{ height: '100%' }}>
                <Sheet
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        wordBreak: 'break-all',
                    }}
                >
                    <Typography level="h2" display={{ xs: 'none', md: 'block' }}>
                        {refDisc.title}
                    </Typography>
                    <Typography
                        level="h3"
                        display={{ xs: 'none', sm: 'block', md: 'none' }}
                    >
                        {refDisc.title}
                    </Typography>
                    <Typography level="h4" display={{ xs: 'block', sm: 'none' }}>
                        {refDisc.title}
                    </Typography>
                    <Button
                        onClick={() => navigate({ to: `/collections/${collectionId}` })}
                        sx={{ minWidth: '15dvh' }}
                    >
                        Back
                    </Button>
                </Sheet>
                <Divider />
                <Sheet>
                    <AspectRatio objectFit="contain">
                        <img src={`${refDisc.images[0]}`} />
                    </AspectRatio>
                    <Table
                        sx={{
                            '& thead th:nth-child(1)': {
                                width: { xs: '40%', sm: '30%', md: '20%' },
                            },
                        }}
                    >
                        <thead>
                            <tr>
                                <th>Barcode</th>
                                <th>{refDisc.barcode}</th>
                            </tr>
                            <tr>
                                <th>Title</th>
                                <th>{refDisc.title}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Category</td>
                                <td>{refDisc.category}</td>
                            </tr>
                            <tr>
                                <td>Original Title</td>
                                <td>{refDisc.title}</td>
                            </tr>
                            <tr>
                                <td>Description</td>
                                <td>{refDisc.description}</td>
                            </tr>
                            <tr>
                                <td>Brand</td>
                                <td>{refDisc.brand}</td>
                            </tr>
                            <tr>
                                <td>Model</td>
                                <td>{refDisc.model}</td>
                            </tr>
                            <tr>
                                <td>Dimension</td>
                                <td>{refDisc.dimension}</td>
                            </tr>
                            <tr>
                                <td>Weight</td>
                                <td>{refDisc.weight}</td>
                            </tr>
                            <tr>
                                <td>Currency</td>
                                <td>{refDisc.currency}</td>
                            </tr>
                            <tr>
                                <td>Lowest Recorded Price</td>
                                <td>{refDisc.lowest_recorded_price}</td>
                            </tr>
                            <tr>
                                <td>Highest Recorded Price</td>
                                <td>{refDisc.highest_recorded_price}</td>
                            </tr>
                            <tr>
                                <td>EAN</td>
                                <td>{refDisc.ean}</td>
                            </tr>
                            <tr>
                                <td>UPC</td>
                                <td>{refDisc.upc}</td>
                            </tr>
                            <tr>
                                <td>GTIN</td>
                                <td>{refDisc.gtin}</td>
                            </tr>
                            <tr>
                                <td>ASIN</td>
                                <td>{refDisc.asin}</td>
                            </tr>
                            <tr>
                                <td>Images</td>
                                <td>{refDisc.images}</td>
                            </tr>
                        </tbody>
                    </Table>
                </Sheet>
            </Stack>
        </>
    )
}

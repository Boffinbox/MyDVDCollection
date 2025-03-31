import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import
{
    AccessTokenQueryOptions,
    CollectionQueryOptions,
    CollectionsQueryOptions,
    DiscQueryOptions,
    ReferenceQueryOptions,
} from '../../utilities/Queries'
import { IDisc, IReferenceDisc } from '../../Interfaces'
import
{
    AspectRatio,
    Button,
    Divider,
    Sheet,
    Stack,
    Table,
    Typography,
} from '@mui/joy'

export const Route = createFileRoute(
    '/_mdc/collections_/$collectionId_/$discId',
)({
    component: Disc,
    beforeLoad: async ({ context: { queryClient }, params }) =>
    {
        const token = await queryClient.ensureQueryData(AccessTokenQueryOptions())
        await queryClient.ensureQueryData(CollectionQueryOptions(token, params.collectionId))
        await queryClient.ensureQueryData(DiscQueryOptions(token, params.collectionId, params.discId))
    },
})

function Disc()
{
    const { collectionId, discId } = Route.useParams()

    const navigate = useNavigate()

    const tokenQuery = useQuery(AccessTokenQueryOptions())
    const token: string | undefined = tokenQuery.data

    const discQuery = useQuery(DiscQueryOptions(token, collectionId, discId))
    const disc = discQuery.data

    const refQuery = useQuery(ReferenceQueryOptions(token, disc.referenceDVD))
    const refDisc = refQuery.data

    if (discQuery.isLoading || refQuery.isLoading)
        return (
            <Typography level="h1" sx={{ height: '100%' }}>
                Loading...
            </Typography>
        )
    if (discQuery.isError)
        return (
            <>
                <div>Oh no! Something went wrong...</div>
                <pre>{JSON.stringify(discQuery.error.message)}</pre>
            </>
        )
    if (refQuery.isError)
        return (
            <>
                <div>Oh no! Something went wrong...</div>
                <pre>{JSON.stringify(refQuery.error.message)}</pre>
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

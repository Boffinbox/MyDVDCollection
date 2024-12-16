import { createFileRoute } from '@tanstack/react-router'
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
import { DiscListItem } from '../../components/DiscListItem'
import { Divider, List, Stack, Typography } from '@mui/joy'

export const Route = createFileRoute('/_mdc/collections/$collectionId/$discId')({
    component: Disc,
})

function Disc()
{
    const { collectionId, discId } = Route.useParams()

    const queryClient = useQueryClient()

    const tokenQuery = useQuery(AccessTokenQueryOptions())
    const token: string | undefined = tokenQuery.data

    const collectionsQuery = useQuery(CollectionsQueryOptions(token))
    const collections: ICollectionHydrated[] = collectionsQuery.data
    const collection: ICollectionHydrated = collections.find(
        (coll) => coll._id === collectionId,
    )!
    const disc: IDisc = collection.discs.find(disc => disc._id === discId)!

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
            {disc.referenceDVD.title}
        </>
    )
}

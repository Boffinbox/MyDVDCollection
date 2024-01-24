import { FileRoute } from "@tanstack/react-router"
import { FetchCollection } from "../../fetch/FetchCollection";

export const Route = new FileRoute('/_mdc/collections/$collectionId').createRoute({
    loader: async ({ params: { collectionId }, context: { auth } }) => FetchCollection(collectionId, auth.token),
    component: Collection
})

function Collection()
{
    const data: {
        _id: string,
        title: string,
        discs: [
            {
                _id: string,
                rating: number,
                watched: boolean,
                referenceDVD:
                {
                    _id: string,
                    barcode: string,
                    title: string
                }
            }
        ]
    } = Route.useLoaderData();
    console.log(data)

    return (
        <>
            <h3>{data.title}</h3>
            <div>
                {data.discs.map((disc, idx) => (
                    <div key={disc._id}>
                        Disc {idx + 1}: {disc.referenceDVD.title}
                        {` `}
                        <button>
                            Delete!
                        </button>
                    </div>
                ))}
            </div>
        </>
    )
}
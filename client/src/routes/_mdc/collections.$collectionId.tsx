import { createFileRoute, useRouter } from "@tanstack/react-router"
import { GetCollection } from "../../httpverbs/get/GetCollection";
import { DeleteDisc } from "../../httpverbs/delete/DeleteDisc";
import { PostBarcode } from "../../httpverbs/post/PostBarcode";
import { StateChangingButton } from "../../components/StateChangingButton";
import { SingleLineForm } from "../../components/SingleLineForm";

export const Route = createFileRoute('/_mdc/collections/$collectionId')({
    loader: async ({ params: { collectionId }, context: { auth } }) => GetCollection(collectionId, auth.token),
    component: Collection
})

function Collection()
{
    const { token } = Route.useRouteContext({ select: ({ auth }) => ({ token: auth.token }) })

    interface ICollData
    {
        _id: string,
        title: string,
        discs:
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
        }[]
    }

    const collData: ICollData = Route.useLoaderData()
    const router = useRouter();

    return (
        <>
            <h3>{collData.title}</h3>
            <SingleLineForm
                submitButtonText="Submit!"
                labelText="Barcode"
                toServer={async (barcode) => await PostBarcode(token, collData._id, barcode)}
                toClient={() => 
                {
                    console.log("invalidating router...")
                    router.invalidate()
                }}
            />
            <div>
                {collData.discs.map((disc, idx) => (
                    <div key={disc._id}>
                        Disc {idx + 1}: Barcode: {disc.referenceDVD.barcode}, {disc.referenceDVD.title}
                        {` `}
                        <StateChangingButton
                            text={"Delete..."}
                            toServer={async () => await DeleteDisc(token, collData._id, disc._id)}
                            toClient={() => router.invalidate()}
                        />
                    </div>
                ))}
            </div >
        </>
    )
}
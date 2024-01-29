import { createFileRoute } from "@tanstack/react-router"
import { GetCollection } from "../../httpverbs/get/GetCollection";
import { DeleteDisc } from "../../httpverbs/delete/DeleteDisc";
import { PostBarcode } from "../../httpverbs/post/PostBarcode";
import { StateChangingButton } from "../../components/StateChangingButton";
import { SingleLineForm } from "../../components/SingleLineForm";
import { ICollectionHydrated } from "../../Interfaces";

export const Route = createFileRoute('/_mdc/collections/$collectionId')({
    loader: async ({ params: { collectionId }, context: { auth } }) => GetCollection(collectionId, auth.token),
    component: Collection
})

function Collection()
{
    const { token } = Route.useRouteContext({ select: ({ auth }) => ({ token: auth.token }) })

    const collData: ICollectionHydrated = Route.useLoaderData()

    return (
        <>
            <h3>{collData.title}</h3>
            <SingleLineForm
                submitButtonText="Submit!"
                labelText="Barcode"
                onSubmit={async (barcode) => await PostBarcode(token, collData._id, barcode)}
            />
            <div>
                {collData.discs.map((disc, idx) => (
                    <div key={disc._id}>
                        Disc {idx + 1}: Barcode: {disc.referenceDVD.barcode}, {disc.referenceDVD.title}
                        {` `}
                        <StateChangingButton
                            text={"Delete..."}
                            onSubmit={async () => await DeleteDisc(token, collData._id, disc._id)}
                        />
                    </div>
                ))}
            </div >
        </>
    )
}
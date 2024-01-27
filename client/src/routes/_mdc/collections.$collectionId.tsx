import { createFileRoute, useRouter } from "@tanstack/react-router"
import { GetCollection } from "../../httpverbs/get/GetCollection";
import { DeleteDisc } from "../../httpverbs/delete/DeleteDisc";
import { PostBarcode } from "../../httpverbs/post/PostBarcode";
import { useState } from "react";
import { StateChangingButton } from "../../components/StateChangingButton";

export const Route = createFileRoute('/_mdc/collections/$collectionId')({
    loader: async ({ params: { collectionId }, context: { auth } }) => GetCollection(collectionId, auth.token),
    component: Collection
})

function Collection()
{
    const { token } = Route.useRouteContext({ select: ({ auth }) => ({ token: auth.token }) })
    const [formData, setFormData] = useState({ barcode: "" })

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

    function handleChange(evt: React.ChangeEvent<HTMLInputElement>)
    {
        setFormData(currentData =>
        {
            return {
                ...currentData,
                [evt.target.name]: evt.target.value
            }
        })
    }

    return (
        <>
            <h3>{collData.title}</h3>
            <label htmlFor="barcode">barcode</label>
            <input type="text" id="barcode" name="barcode" onChange={handleChange} value={formData.barcode} />
            <StateChangingButton
                text={"Submit!"}
                toServer={async () =>
                {
                    await PostBarcode(token, collData._id, formData.barcode)
                    setFormData(() => { return { barcode: "" } })
                }}
                toClient={() => router.invalidate()}
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
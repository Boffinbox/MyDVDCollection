import { FileRoute, useRouter } from "@tanstack/react-router"
import { GetCollection } from "../../httpverbs/get/GetCollection";
import { DeleteDisc } from "../../httpverbs/delete/DeleteDisc";
import { PostBarcode } from "../../httpverbs/post/PostBarcode";
import { useState } from "react";
import { AddButton } from "../../components/AddButton";
import { DeleteButton } from "../../components/DeleteButton";

export const Route = new FileRoute('/_mdc/collections/$collectionId').createRoute({
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
            <AddButton
                addToServer={async () =>
                {
                    await PostBarcode(token, collData._id, formData.barcode)
                    setFormData(() => { return { barcode: "" } })
                }}
                addToClient={() => router.invalidate()}
            />
            <div>
                {collData.discs.map((disc, idx) => (
                    <div key={disc._id}>
                        Disc {idx + 1}: {disc.referenceDVD.title}
                        {` `}
                        <DeleteButton
                            deleteFromServer={async () => await DeleteDisc(token, collData._id, disc._id)}
                            deleteFromClient={() => router.invalidate()}
                        />
                    </div>
                ))}
            </div >
        </>
    )
}
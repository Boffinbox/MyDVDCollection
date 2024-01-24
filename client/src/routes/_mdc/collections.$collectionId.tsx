import { FileRoute } from "@tanstack/react-router"
import { GetCollection } from "../../httpverbs/get/GetCollection";
import { DeleteDisc } from "../../httpverbs/delete/DeleteDisc";
import { PostBarcode } from "../../httpverbs/post/PostBarcode";
import { useState } from "react";

export const Route = new FileRoute('/_mdc/collections/$collectionId').createRoute({
    loader: async ({ params: { collectionId }, context: { auth } }) => GetCollection(collectionId, auth.token),
    component: Collection
})

function Collection()
{
    const { token } = Route.useRouteContext({ select: ({ auth }) => ({ token: auth.token }) })
    const [formData, setFormData] = useState({ barcode: "" })

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
            <h3>{data.title}</h3>
            <form action="" onSubmit={async (evt) => 
            {
                evt.preventDefault();
                try
                {
                    await PostBarcode(token, data._id, formData.barcode)
                    setFormData(() => { return { barcode: "" } })
                }
                catch (e)
                {
                    console.log(e);
                }
            }}>
                <p>
                    <label htmlFor="barcode">barcode</label>
                    <input type="text" id="barcode" name="barcode" onChange={handleChange} value={formData.barcode} />
                    {` `}
                    <button>
                        Submit!
                    </button>
                </p>
            </form>
            <div>
                {data.discs.map((disc, idx) => (
                    <div key={disc._id}>
                        <form action="" onSubmit={async (evt) =>
                        {
                            evt.preventDefault();
                            try
                            {
                                await DeleteDisc(token, data._id, disc._id)
                            }
                            catch (e)
                            {
                                console.log(e);
                            }
                        }}>
                            Disc {idx + 1}: {disc.referenceDVD.title}
                            {` `}
                            <button>
                                Delete!
                            </button>
                        </form>
                    </div>
                ))}
            </div >
        </>
    )
}
import { Link, Outlet, FileRoute, useRouter } from "@tanstack/react-router"
import { GetCollections } from "../../httpverbs/get/GetCollections"
import { DeleteCollection } from "../../httpverbs/delete/DeleteCollection";
import { useState } from "react";
import { PostCollection } from "../../httpverbs/post/PostCollection";
import { StateChangingButton } from "../../components/StateChangingButton";

export const Route = new FileRoute('/_mdc/collections').createRoute({
    loader: async ({ context: { auth } }) => await GetCollections(auth.token),
    component: Collections
})

function Collections()
{
    const { token } = Route.useRouteContext({ select: ({ auth }) => ({ token: auth.token }) })

    const router = useRouter();

    const data: [{ _id: string, title: string }] = Route.useLoaderData();
    console.log("My coll data is: ", data)

    const [formData, setFormData] = useState({ title: "" })

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
            <label htmlFor="title">Title</label>
            <input type="text" id="title" name="title" onChange={handleChange} value={formData.title} />
            <StateChangingButton
                text={"Submit!"}
                toServer={async () =>
                {
                    await PostCollection(token, formData.title)
                    setFormData(() => { return { title: "" } })
                }}
                toClient={() => router.invalidate()}
            />
            <div>
                Collections {` `}
                {data.map((coll) => (
                    <div key={coll._id}>
                        <Link
                            to="/collections/$collectionId"
                            params={{
                                collectionId: coll._id
                            }}
                        >
                            Click to load the "{coll.title} collection".
                        </Link>
                        {` `}
                        <StateChangingButton
                            text={"Delete..."}
                            toServer={async () => await DeleteCollection(token, coll._id)}
                            toClient={() => router.invalidate()}
                        />
                    </div>
                ))}
                <hr />
                <Outlet />
            </div>
        </>
    )
}
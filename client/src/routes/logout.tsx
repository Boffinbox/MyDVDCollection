import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PostLogout } from "../httpverbs/PostLogout";
import { Wait } from "../utilities/Wait";
import { GetAccessToken } from "../httpverbs/GetAccessToken";

export const Route = createFileRoute('/logout')({
    beforeLoad: async ({ context: { queryClient } }) =>
    {
        let token: string | undefined = await queryClient.getQueryData(["accesstoken"])
        console.log("in preloader: ", token)
        if (token == undefined)
        {
            token = await GetAccessToken()
        }
        if (token == undefined) // if it's *still* undefined
        {
            // todo - something went wrong
            return
        }
        try
        {
            await PostLogout(token)
            queryClient.removeQueries({ queryKey: ["accesstoken"], exact: true })
        }
        catch
        {
            console.log("oh no!");
        }
    },
    component: Logout
})

function Logout()
{
    const navigate = useNavigate();

    // this is just a fake delay to make the user feel good
    Wait(1000).then(() => navigate({ to: "/" }))

    return (
        <>
            <div>Logging out...</div>
        </>
    )
}
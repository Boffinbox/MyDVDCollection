import { FileRoute, useNavigate } from "@tanstack/react-router";
import { auth } from "../utilities/Auth";

export const Route = new FileRoute('/logout').createRoute({
    beforeLoad: async () =>
    {
        if (auth.status === "loggedIn")
        {
            await auth.logout();
        }
    },
    component: Logout
})

function Logout()
{
    const navigate = useNavigate();

    setTimeout(() => navigate({ to: "/" }), 1000)

    return (
        <>
            <div>Logging out...</div>
        </>
    )
}
import { FileRoute, Outlet } from '@tanstack/react-router'
import { auth } from '../utilities/Auth';

export const Route = new FileRoute('/_mdc').createRoute({
    beforeLoad: async () =>
    {
        if (auth.status == "loggedOut" || auth.token == undefined)
        {
            console.log("tane");
            await auth.refreshAccessToken();
        }
    },
    component: MDCComponent
})

function MDCComponent()
{
    return (
        <Outlet />
    )
}
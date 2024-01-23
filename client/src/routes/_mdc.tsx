import { FileRoute, Outlet, redirect } from '@tanstack/react-router'
import { auth } from '../utilities/Auth';

export const Route = new FileRoute('/_mdc').createRoute({
    beforeLoad: async () =>
    {
        if (auth.status == "loggedOut" || auth.token == undefined)
        {
            await auth.refreshAccessToken();
            if (auth.status == "loggedOut" || auth.token == undefined)
            {
                throw redirect({
                    to: "/login",
                    search: {
                        redirect: location.href
                    }
                })
            }
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
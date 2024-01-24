import { FileRoute, redirect } from "@tanstack/react-router";
import { auth } from "../utilities/Auth";

export const Route = new FileRoute('/logout').createRoute({
    beforeLoad: async () =>
    {
        await auth.logout();
        throw redirect({
            to: "/"
        })
    }
})
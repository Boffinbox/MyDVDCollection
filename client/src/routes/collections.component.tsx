import { Outlet } from "@tanstack/react-router"

export const component = function Collections()
{
    return (
        <>
            <div>
                Collections
                <hr />
                <Outlet />
            </div>
        </>
    )
}
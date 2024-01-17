import { Link, Outlet } from "@tanstack/react-router"

export const component = function Collections()
{
    return (
        <>
            <div>
                Collections {` `}
                <Link to="/collections/collection">Click to load example collection.</Link>
                <hr />
                <Outlet />
            </div>
        </>
    )
}
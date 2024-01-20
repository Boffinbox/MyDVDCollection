import { Link, Outlet } from "@tanstack/react-router"

export const component = function Collections()
{
    return (
        <>
            <div>
                Collections {` `}
                <Link
                    to="/collections/$collectionId"
                    params={{
                        collectionId: "6557a7fe22dd6bff7082b921"
                    }}
                >Click to load example collection.</Link>
                <hr />
                <Outlet />
            </div>
        </>
    )
}
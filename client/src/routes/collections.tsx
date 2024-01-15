import { Link, Outlet } from "@tanstack/react-router";

export default function Collections()
{
    return (
        <>
            <div>
                Collections
                <Link
                    to="/collections/$collectionId"
                    params={{
                        collectionId: "1"
                    }}
                >One</Link>
                <Link
                    to="/collections/$collectionId"
                    params={{
                        collectionId: "2"
                    }}
                >Two</Link>
                <Outlet />
            </div>
        </>
    )
}
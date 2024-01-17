import { Link, Outlet } from "@tanstack/react-router"

export const component = function About()
{
    return <>
        <div className="p-2">Hello from About!</div>
        <Link to="/about/post">About Post</Link>
        <hr />
        <Outlet />
    </>

}
import { useState } from "react"
import { UserContext } from "../components/UserContext"
import { LoginRefresh } from "../components/LoginRefresh"
import { Outlet, Link } from "react-router-dom";

export default function Root()
{
    const [userToken, setUserToken] = useState<string>("");
    return (
        <>
            <UserContext.Provider value={{ userToken, setUserToken }}>
                <div>
                    <LoginRefresh />
                </div >
                <div id="navbar">
                    <h1>My DVD Collection</h1>
                    <div>
                        <form id="search-form" role="search">
                            <input
                                id="q"
                                aria-label="Search My Collections"
                                placeholder="Search My Collections"
                                type="search"
                                name="q"
                            />
                        </form>
                        <form method="post">
                            <button type="submit">New</button>
                        </form>
                    </div>
                    <nav>
                        <ul>
                            <li>
                                <Link to={`/`}>Root</Link>
                            </li>
                            <li>
                                <Link to={`/login`}>Login</Link>
                            </li>
                            <li>
                                <Link to={`/collections`}>Collections</Link>
                            </li>
                        </ul>
                    </nav>
                </div>
                <div id="main">
                    <Outlet />
                </div>
            </UserContext.Provider>
        </>
    );
}
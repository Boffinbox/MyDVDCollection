import { UserContext } from "./components/UserContext"
import { useState } from "react";
import LoginRefresh from "./components/LoginRefresh";
import Login from "./routes/login";
import Root from "./routes/root";
// tanstack router
import { RootRoute, Route, Router } from "@tanstack/react-router";

const rootRoute = new RootRoute({ component: Root, });
const indexRoute = new Route({ getParentRoute: () => rootRoute, path: "/" })
const loginRoute = new Route({ getParentRoute: () => rootRoute, path: "login" })

const routeTree = rootRoute.addChildren([
    indexRoute,
    loginRoute,
])

const router = new Router({ routeTree })

declare module '@tanstack/react-router' {
    interface Register
    {
        router: typeof router
    }
}

// export function App()
// {
//     const [userToken, setUserToken] = useState<string>("");

//     return <div>
//         <RouterProvider router={router} />
//         <UserContext.Provider value={{ userToken, setUserToken }}>
//             <LoginRefresh />
//             <Login />
//         </UserContext.Provider>
//     </div >
// }
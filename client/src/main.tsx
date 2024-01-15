import React from 'react'
import ReactDOM from 'react-dom/client';
import { App } from './App';
import ErrorPage from './components/ErrorPage';

import
{
    RootRoute,
    Route,
    Router,
    RouterProvider,
    NotFoundRoute
} from "@tanstack/react-router";


const rootRoute = new RootRoute();
const indexRoute = new Route({ getParentRoute: () => rootRoute, path: "/", component: App })
const loginRoute = new Route({ getParentRoute: () => rootRoute, path: "login" })
const collectionsRoute = new Route({ getParentRoute: () => rootRoute, path: "collections" })
const collectionsIndexRoute = new Route({ getParentRoute: () => collectionsRoute, path: "/" })

const notFoundRoute = new NotFoundRoute({ getParentRoute: () => rootRoute, component: ErrorPage })

const routeTree = rootRoute.addChildren([
    indexRoute,
    loginRoute,
    collectionsRoute.addChildren([
        collectionsIndexRoute
    ])
])

const router = new Router({ routeTree, notFoundRoute })

declare module '@tanstack/react-router' {
    interface Register
    {
        router: typeof router
    }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>,
)
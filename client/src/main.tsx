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

import Index from './routes';
import Login from './routes/login';
import Collections from './routes/collections';
import Collection from './routes/collection';

// define routes
const rootRoute = new RootRoute({ component: App });

const indexRoute = new Route({ getParentRoute: () => rootRoute, path: "/", component: Index })

const loginRoute = new Route({ getParentRoute: () => rootRoute, path: "login", component: Login })

const collectionsRoute = new Route({ getParentRoute: () => rootRoute, path: "collections", component: Collections })
const collectionsIndexRoute = new Route({ getParentRoute: () => collectionsRoute, path: "/" })
const collectionsSingleRoute = new Route({ getParentRoute: () => collectionsRoute, path: "$collectionId", component: Collection })

const splatRoute = new Route({ getParentRoute: () => rootRoute, path: "$", component: ErrorPage })

const routeTree = rootRoute.addChildren([
    indexRoute,
    loginRoute,
    collectionsRoute.addChildren([
        collectionsIndexRoute,
        collectionsSingleRoute
    ]),
    splatRoute
])

const notFoundRoute = new NotFoundRoute({ getParentRoute: () => rootRoute, component: () => <div>Oh no! 404 Error :&#40;</div> })

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
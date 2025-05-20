import * as React from 'react'
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { QueryClient } from '@tanstack/react-query';

// import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import ErrorPage from '../utilities/ErrorPage';

import axios from "axios"

if (process.env.NODE_ENV == "production")
{
    axios.defaults.baseURL = `${import.meta.env.VITE_API_URL}`
}

declare module '@mui/joy/Drawer' {
    interface DrawerPropsSizeOverrides
    {
        xs: true;
    }
}

const ReactQueryDevtoolsProduction = React.lazy(() =>
    import('@tanstack/react-query-devtools/build/modern/production.js').then(
        (d) => ({
            default: d.ReactQueryDevtools,
        }),
    ),
)

export const Route = createRootRouteWithContext<{
    queryClient: QueryClient
}>()({
    component: App,
    errorComponent: ErrorPage
})

function App()
{
    const [showDevtools, setShowDevtools] = React.useState(false)

    React.useEffect(() =>
    {
        // @ts-expect-error
        window.toggleDevtools = () => setShowDevtools((old) => !old)
    }, [])

    return <div>
        <Outlet />
        {showDevtools && (
            <React.Suspense fallback={null}>
                <ReactQueryDevtoolsProduction />
            </React.Suspense>
        )}
        <ReactQueryDevtools buttonPosition='top-right' position='right' />
        {/* <TanStackRouterDevtools position='top-left' /> */}
    </div >
}
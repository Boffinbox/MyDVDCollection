import React from 'react'
import ReactDOM from 'react-dom/client';
import "@fontsource/inter"
import "./index.css"

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createRouter } from '@tanstack/react-router'

// Import the generated route tree
import { routeTree } from './routeTree.gen'
import ScrollContextProvider from './components/ScrollContextProvider';

export const queryClient = new QueryClient();

// Create a new router instance
const router = createRouter({
    routeTree,
    context: {
        queryClient,
    },
})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
    interface Register
    {
        router: typeof router
    }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <ScrollContextProvider>
                <RouterProvider router={router} context={{ queryClient }} />
            </ScrollContextProvider>
        </QueryClientProvider>
    </React.StrictMode>,
)
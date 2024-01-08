import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Root from './routes/root'
import ErrorPage from './components/ErrorPage'
// route components go here
import Collections from './routes/collections'
import Login from './routes/login'

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: "login",
                element: <Login />
            },
            {
                path: "collections",
                element: <Collections />
            }
        ],
    }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>,
)
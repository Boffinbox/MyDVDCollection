import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom"
import Root from './routes/root'
import ErrorPage from './components/ErrorPage'
// route components go here
import Collections from './routes/collections'
import Login from './routes/login'

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<Root />}>
            <Route path="login" element={<Login />} />
            <Route path="collections" element={<Collections />} />
            <Route path="*" element={<ErrorPage />} />
        </Route>
    ))

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>,
)
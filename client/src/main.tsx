import React from 'react'
import ReactDOM from 'react-dom/client';
import { Link, Route } from "wouter";
// route components go here
import ErrorPage from './components/ErrorPage'
import Root from './routes/root'
import Collections from './routes/collections'
import Login from './routes/login'

const Router = () => (
    <div>
        <Link href="/">
            <a className="link">Root</a>
        </Link>
        <Link href="/login">
            <a className="link">Login</a>
        </Link>
        <Link href="/collections">
            <a className="link">Collections</a>
        </Link>

        <Route path="/" component={Root} />
        <Route path="/login" component={Login} />
        <Route path="/collections" component={Collections} />
        <Route path="*" component={ErrorPage} />
    </div>
);

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <Router />
    </React.StrictMode>,
)
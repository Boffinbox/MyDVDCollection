import { Link, Route, Switch } from "wouter";
import { UserContext } from "./components/UserContext"
import { useState } from "react";
import LoginRefresh from "./components/LoginRefresh";
// route components go here
import ErrorPage from './components/ErrorPage'
import Root from './routes/root'
import Collections from './routes/collections'
import Login from './routes/login'


export function App()
{
    const [userToken, setUserToken] = useState<string>("");
    return <div>
        <UserContext.Provider value={{ userToken, setUserToken }}>
            <LoginRefresh />

            <nav className="navbar">
                <Link href="/">Root</Link>
                <Link href="/login">Login</Link>
                <Link href="/collections">Collections</Link>
            </nav>

            <Switch>
                <Route path="/" component={Root} />
                <Route path="/login" component={Login} />
                <Route path="/collections" component={Collections} />
                <Route component={ErrorPage} />
            </Switch>
        </UserContext.Provider>
    </div>
}
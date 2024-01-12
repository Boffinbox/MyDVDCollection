import { Link, Route, Router, Switch, useRouter } from "wouter";
import { UserContext } from "./components/UserContext"
import { useState } from "react";
import LoginRefresh from "./components/LoginRefresh";
// route components go here
import ErrorPage from './components/ErrorPage'
import Root from './routes/root'
import Collections from './routes/collections'
import Login from './routes/login'
import TestNest from "./oldtest/TestNest";


export function App()
{
    const [userToken, setUserToken] = useState<string>("");
    // return <div>
    //     <UserContext.Provider value={{ userToken, setUserToken }}>
    //         <LoginRefresh />

    //         <nav className="navbar">
    //             <Link href="/">Root</Link>
    //             <Link href="/login">Login</Link>
    //             <Link href="/collections">Collections</Link>
    //         </nav>

    //         <Switch>
    //             <Route path="/" component={Root} />
    //             <Route path="/login" component={Login} />
    //             <Route path="/collections" component={Collections} />
    //             <Route component={ErrorPage} />
    //         </Switch>
    //     </UserContext.Provider>
    // </div>
    const router = useRouter();
    return <div>
        Main Page
        <Router base="/app">
            <Route path="/home">Home</Route>
            <TestNest router={router} />
        </Router>
    </div>
}
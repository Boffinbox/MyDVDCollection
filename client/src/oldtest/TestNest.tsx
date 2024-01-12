import { Route, Router, useRouter } from "wouter";

export default function TestNest(props: any)
{
    const router = useRouter();
    return (
        <div>
            Users Default
            <Router base="/users" parent={router}>
                <Route path="/all">All Users</Route>
                <Route path="/:id">User Profile</Route>
            </Router>
        </div>
    )
}
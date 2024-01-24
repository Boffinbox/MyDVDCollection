import { useState } from "react";
import { FileRoute, Link, redirect, useRouter } from "@tanstack/react-router";
import { auth } from "../utilities/Auth";

export const Route = new FileRoute('/login').createRoute({
    beforeLoad: async () =>
    {
        if (auth.status == "loggedOut" || auth.token == undefined)
        {
            await auth.refreshAccessToken();
        }
        if (auth.status == "loggedIn")
            throw redirect({
                to: "/collections"
            })
    },
    component: LoginComponent
})

function LoginComponent()
{
    const router = useRouter();
    const { auth, status } = Route.useRouteContext({ select: ({ auth }) => ({ auth, status: auth.status }) })

    const [formData, setFormData] = useState({ email: "", password: "" })

    function handleChange(evt: React.ChangeEvent<HTMLInputElement>)
    {
        setFormData(currentData =>
        {
            return {
                ...currentData,
                [evt.target.name]: evt.target.value
            }
        })
    }

    async function handleSubmit(evt: React.FormEvent<HTMLFormElement>)
    {
        evt.preventDefault();
        console.log("Form submitted!");
        console.log("Email is: ", formData.email);
        console.log("Password is: ", formData.password);
        const result = await auth.login(formData.email, formData.password);
        router.invalidate();
        if (result !== "loggedIn")
        {
            // todo
            console.log("wrong credentials todo inside login.tsx")
        }
        else
        {
            setFormData(() => { return { email: "", password: "" } })
        }
    }

    return status === "loggedIn" ? (
        <>
            <p>Logged in!</p>
            <button
                onClick={async () =>
                {
                    await auth.logout()
                    router.invalidate();
                }}
            >
                Logout
            </button>
        </>
    ) : (
        <>
            <div>
                <form action="" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email">email</label>
                        <input type="text" id="email" name="email" onChange={handleChange} value={formData.email} />
                    </div>
                    <div>
                        <label htmlFor="password">password</label>
                        <input type="text" id="password" name="password" onChange={handleChange} value={formData.password} />
                    </div>
                    <button>Submit!</button>
                </form>
                <Link
                    to={"/"}
                >
                    Return to homepage
                </Link>
            </div>
        </>
    )
}
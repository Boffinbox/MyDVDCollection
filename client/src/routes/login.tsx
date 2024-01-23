import { useState } from "react";
import { FileRoute, useRouter } from "@tanstack/react-router";

export const Route = new FileRoute('/login').createRoute({
    component: LoginComponent
})

function LoginComponent()
{
    const [formData, setFormData] = useState({ email: "", password: "" })
    const router = useRouter();
    const { auth, status } = Route.useRouteContext({ select: ({ auth }) => ({ auth, status: auth.status }) })

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
        await auth.login(formData.email, formData.password);
        router.invalidate();
        setFormData(() => { return { email: "", password: "" } })
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
            </div>
        </>
    )
}
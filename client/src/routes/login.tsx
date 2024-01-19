import { useState } from "react";
import { FileRoute } from "@tanstack/react-router";

export const Route = new FileRoute('/login').createRoute({
    component: LoginComponent
})

function LoginComponent()
{
    const [formData, setFormData] = useState({ email: "", password: "" })

    const { auth } = Route.useRouteContext({ select: ({ auth }) => ({ auth }) })

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

    function handleSubmit(evt: React.FormEvent<HTMLFormElement>)
    {
        evt.preventDefault();
        console.log("Form submitted!");
        console.log("Email is: ", formData.email);
        console.log("Password is: ", formData.password);
        auth.login(formData.email, formData.password);
        if (auth.status === "loggedIn")
        {
            setFormData(() => { return { email: "", password: "" } })
            console.log("My auth token is: " + auth.token);
        }
        else
        {

        }
        // const userData = {
        //     email: formData.email,
        //     password: formData.password
        // }
        // axios.post(`/api/v1/users/login`, userData).then((response) =>
        // {
        //     console.log("Login post request received.");
        //     user.setUserToken(() => response.data.token);
        //     setFormData(() => { return { email: "", password: "" } })
        // }).catch((e) =>
        // {
        //     console.log(e);
        // })
    }

    return (
        <div>
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
        </div>
    )
}
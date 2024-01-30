import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { PostLogin } from "../httpverbs/PostLogin";

export const Route = createFileRoute('/login')({
    component: LoginComponent
})

function LoginComponent()
{
    const navigate = useNavigate();

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
        try
        {
            await PostLogin(formData.email, formData.password);
            setFormData(() => { return { email: "", password: "" } })
            navigate({ to: "/collections" });
        }
        catch
        {
            // todo
            console.log("wrong credentials todo inside login.tsx")
        }
    }

    return (
        <>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", textAlign: "center" }}>
                <form action="" onSubmit={handleSubmit}>
                    <p>
                        <label htmlFor="email">email</label>
                        <input type="text" id="email" name="email" onChange={handleChange} value={formData.email} />
                    </p>
                    <p>
                        <label htmlFor="password">password</label>
                        <input type="text" id="password" name="password" onChange={handleChange} value={formData.password} />
                    </p>
                    <p>
                        <button>Submit!</button>
                    </p>
                    <p>
                        <Link
                            to={"/"}
                        >
                            Return to homepage
                        </Link>
                    </p>
                </form>
            </div>
        </>
    )
}
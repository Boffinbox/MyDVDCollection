import axios from "axios";
import { useState } from "react";

export function TestLoginSubmit()
{
    const [formData, setFormData] = useState({ email: "", password: "" })
    const [tokenData, setTokenData] = useState({ token: "" })

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
        const userData = {
            email: formData.email,
            password: formData.password
        }
        axios.post(`/api/v1/users/login`, userData).then((response) =>
        {
            console.log("Login post request received.");
            setTokenData((oldToken) =>
            {
                return { ...oldToken, token: response.data.token }
            })
        }).catch((e) =>
        {
            console.log(e);
        })
    }

    return (
        <div>
            <div style={{ backgroundColor: "darkblue" }}>
                <form action="" onSubmit={handleSubmit}>
                    <p>form to login and get a refresh token</p>
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
            <div>our token data is: {tokenData.token}</div>
        </div>
    )
}
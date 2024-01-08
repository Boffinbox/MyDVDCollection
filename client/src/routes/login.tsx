import axios from "axios";
import { useState, useContext } from "react";
import { UserContext } from "../components/UserContext";

export default function Login()
{
    const [formData, setFormData] = useState({ email: "", password: "" })
    const user = useContext(UserContext);

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
            user.setUserToken(() => response.data.token)
        }).catch((e) =>
        {
            console.log(e);
        })
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
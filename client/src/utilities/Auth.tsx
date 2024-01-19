import axios from "axios"
import { useState } from "react";

const login = async (email: string, password: string): Promise<string | undefined> =>
{
    const userData = { email, password }
    let token: string | undefined = undefined;
    await axios.post(`/api/v1/users/login`, userData).then((response) =>
    {
        console.log("Login post request received.");
        token = response.data.token;
    }).catch((e) =>
    {
        console.log(e);;
    })
    return token;
}

export interface IAuth
{
    status: "loggedOut" | "loggedIn";
    token?: string | undefined
    login: (email: string, password: string) => void;
    logout: () => void;
}

export const auth: IAuth = {
    status: "loggedOut",
    token: undefined,
    login: async function (email, password)
    {
        const token = await login(email, password);
        if (token != undefined)
        {
            auth.token = token;
            auth.status = "loggedIn"
        }
        else
        {
            auth.status = "loggedOut"
        }
    },
    logout: function ()
    {
        auth.token = undefined;
        auth.status = "loggedOut"
    }
}


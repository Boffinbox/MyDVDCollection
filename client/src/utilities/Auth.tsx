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
    status:
    {
        phase: "loggedOut" | "loggedIn";
        token?: string | undefined
    };
    login: (email: string, password: string) => void;
    logout: () => void;
}

export const auth: IAuth = {
    status:
    {
        phase: "loggedOut",
        token: undefined,
    },
    login: async function (email, password)
    {
        const token = await login(email, password);
        if (token != undefined)
        {
            auth.status.token = token;
            auth.status.phase = "loggedIn"
        }
        else
        {
            auth.status.phase = "loggedOut"
        }
    },
    logout: function ()
    {
        auth.status.token = undefined;
        auth.status.phase = "loggedOut"
    }
}


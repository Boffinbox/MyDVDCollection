import axios from "axios"

export interface IAuth
{
    status: "loggedOut" | "loggedIn" | "pending"
    token?: string | undefined;
    login: (email: string, password: string) => void;
    logout: () => void;
    refreshAccessToken: () => void;
}

export let auth: IAuth = {
    status: "loggedOut",
    token: undefined,
    login: async (email: string, password: string) =>
    {
        auth.status = "pending"
        const userData = { email, password }
        await axios.post(`/api/v1/users/login`, userData).then((response) =>
        {
            console.log("Login post request received.");
            auth.token = response.data.token;
            auth.status = "loggedIn";
        }).catch((e) =>
        {
            auth.status = "loggedOut"
            console.log(e);;
        })
    },
    logout: function ()
    {
        auth.token = undefined;
        auth.status = "loggedOut";
    },
    refreshAccessToken: async function ()
    {
        auth.status = "pending"
        await axios.post(`/api/v1/users/refreshToken`).then((response) =>
        {
            console.log("Refresh request received.");
            auth.token = response.data.token;
            auth.status = "loggedIn"
        }).catch((e) =>
        {
            auth.status = "loggedOut"
            console.log(e);
        })
    }
}

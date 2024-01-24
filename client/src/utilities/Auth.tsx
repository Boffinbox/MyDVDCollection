import axios from "axios"

export interface IAuth
{
    status: "loggedOut" | "loggedIn" | "pending"
    token?: string | undefined;
    login: (email: string, password: string) => Promise<"loggedOut" | "loggedIn" | "pending">;
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
        }).catch(() =>
        {
            auth.status = "loggedOut"
            console.log("Unable to login with provided credentials.");;
        })
        return auth.status
    },
    logout: async function ()
    {
        auth.status = "pending"
        const config =
        {
            headers: { Authorization: `Bearer ${auth.token}` }
        }
        await axios.post(`/api/v1/users/logout`, ``, config).then((response) =>
        {
            console.log("Logout request received - removing refresh cookie.");
            console.log(response);
            auth.token = undefined
            auth.status = "loggedOut"
        }).catch((e) =>
        {
            auth.status = "loggedIn"
            console.log(e);
        })
    },
    refreshAccessToken: async function ()
    {
        auth.status = "pending"
        await axios.post(`/api/v1/users/refreshToken`).then((response) =>
        {
            console.log("Refresh request received.");
            auth.token = response.data.token;
            auth.status = "loggedIn"
        }).catch(() =>
        {
            console.log("Unable to refresh token, redirecting to login...")
            auth.status = "loggedOut"
        })
    }
}

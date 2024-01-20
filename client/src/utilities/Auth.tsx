import axios from "axios"

export interface IAuth
{
    status: "loggedOut" | "loggedIn";
    token?: string | undefined;
    login: (email: string, password: string) => void;
    logout: () => void;
}

export let auth: IAuth = {
    status: "loggedOut",
    token: undefined,
    login: async (email: string, password: string) =>
    {
        const userData = { email, password }
        await axios.post(`/api/v1/users/login`, userData).then((response) =>
        {
            console.log("Login post request received.");
            auth.token = response.data.token;
            auth.status = "loggedIn";
        }).catch((e) =>
        {
            console.log(e);;
        })
    },
    logout: function ()
    {
        auth.token = undefined;
        auth.status = "loggedOut";
    }
}

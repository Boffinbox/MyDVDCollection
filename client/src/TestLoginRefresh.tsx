import axios from "axios";
import { useContext } from "react";
import { UserContext } from "./TestUserContext";

export function TestLoginRefresh()
{
    const user = useContext(UserContext);

    axios.post(`/api/v1/users/refreshToken`).then((response) =>
    {
        console.log("Refresh request received.");
        user.setToken(() => response.data.token)
    }).catch((e) =>
    {
        console.log(e);
    })
    return (
        <div>our token data is: {user.token}</div>
    )
}
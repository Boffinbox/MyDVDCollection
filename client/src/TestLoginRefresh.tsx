import axios from "axios";
import { useEffect, useContext } from "react";
import { UserContext } from "./UserContext";

export function TestLoginRefresh()
{
    const user = useContext(UserContext);

    useEffect(() =>
    {
        axios.post(`/api/v1/users/refreshToken`).then((response) =>
        {
            console.log("Refresh request received.");
            user.setUserToken(() => response.data.token)
        }).catch((e) =>
        {
            console.log(e);
        })
    }, []);

    return (
        <div>our token data is: {user.userToken}</div>
    )
}
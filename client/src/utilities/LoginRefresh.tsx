import axios from "axios";
import { useEffect, useContext } from "react";
import { UserContext } from "./UserContext";

export default function LoginRefresh()
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
        <div>Current token is: {user.userToken}</div>
    )
}
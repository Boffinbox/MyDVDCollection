import { createContext } from "react"

export interface IUserContext
{
    userToken: string;
    setUserToken: React.Dispatch<React.SetStateAction<string>>
}

export const UserContext = createContext<IUserContext>({ userToken: "", setUserToken: () => { } });
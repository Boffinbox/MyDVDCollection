import { createContext } from "react"

export interface IUserContext
{
    token: string;
    setToken: React.Dispatch<React.SetStateAction<string>>
}

export const UserContext = createContext<IUserContext>({ token: "", setToken: () => { } });
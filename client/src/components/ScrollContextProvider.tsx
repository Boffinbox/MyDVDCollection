import { useRef, createContext } from "react";

export const ScrollContext = createContext<any>(null);

const ScrollContextProvider = (props: any) =>
{
    return (
        <ScrollContext.Provider
            value={{
                scrollRef: useRef(),
            }}
        >
            {props.children}
        </ScrollContext.Provider>
    );
};

export default ScrollContextProvider
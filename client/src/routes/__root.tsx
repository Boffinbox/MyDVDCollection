import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { QueryClient } from '@tanstack/react-query';

import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

import { CssVarsProvider, extendTheme } from '@mui/joy/styles';
import { CssBaseline, Sheet } from '@mui/joy';

export const Route = createRootRouteWithContext<{
    queryClient: QueryClient
}>()({
    component: App
})

const mdcTheme = extendTheme({
    // The component identifier always start with `Joy${ComponentName}`.
    components: {
        JoyInput: {
            styleOverrides: {
                root: {
                    borderRadius: "10px"
                }
            }
        }
    }
})

function App()
{
    return <div>
        <CssVarsProvider theme={mdcTheme}>
            <CssBaseline>
                <Sheet
                    variant='plain'
                    sx={{
                        width: { md: 900 },
                        height: "100vh",
                        mx: "auto",
                        my: "auto",
                        py: 2, // padding top & bottom
                        px: 2, // padding left & right
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        // backgroundColor: { xs: "pink", sm: "lightgreen", md: "lightblue" },
                    }}
                >
                    <Outlet />
                </Sheet>
            </CssBaseline>
        </CssVarsProvider>
        <ReactQueryDevtools buttonPosition='top-right' position='right' />
        <TanStackRouterDevtools position='bottom-right' />
    </div >
}
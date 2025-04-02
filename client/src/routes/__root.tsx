import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { QueryClient } from '@tanstack/react-query';

import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

import { CssVarsProvider, extendTheme } from '@mui/joy/styles';
import { CssBaseline, Sheet } from '@mui/joy';

declare module '@mui/joy/Drawer' {
    interface DrawerPropsSizeOverrides
    {
        xs: true;
    }
}

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
                    borderRadius: "6px"
                }
            }
        },
        JoyDrawer: {
            styleOverrides: {
                root: ({ ownerState, theme }) => ({
                    ...(ownerState.size === 'xs' &&
                    {
                        // literally just a blank size, so typescript stops crying about the drawer height...
                    })
                }),
            },
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
                        mx: "auto",
                        my: "auto",
                        // debug color breakpoints
                        // backgroundColor: { xs: "pink", sm: "lightgreen", md: "lightblue" },
                    }}
                >
                    <Outlet />
                </Sheet>
            </CssBaseline>
        </CssVarsProvider>
        {/* <ReactQueryDevtools buttonPosition='top-right' position='right' /> */}
        {/* <TanStackRouterDevtools position='top-left' /> */}
    </div >
}
import { createFileRoute, Outlet } from '@tanstack/react-router'
import { CssBaseline, CssVarsProvider, extendTheme, Sheet } from '@mui/joy';

export const Route = createFileRoute('/_appbase')({
    component: AppBase,
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
                root: ({ ownerState }) => ({
                    ...(ownerState.size === 'xs' &&
                    {
                        // literally just a blank size, so typescript stops crying about the drawer height...
                    })
                }),
            },
        }
    }
})

function AppBase()
{
    return <div>
        <CssVarsProvider theme={mdcTheme}>
            <CssBaseline>
                <Sheet
                    variant="plain"
                    sx={{
                        width: { md: 900 },
                        mx: 'auto',
                        my: 'auto',
                        // debug color breakpoints
                        // backgroundColor: { xs: "pink", sm: "lightgreen", md: "lightblue" },
                    }}
                >
                    <Outlet />
                </Sheet>
            </CssBaseline>
        </CssVarsProvider>
    </div >
}
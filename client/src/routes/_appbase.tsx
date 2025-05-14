import { createFileRoute, Outlet } from '@tanstack/react-router'
import { Sheet } from '@mui/joy';

export const Route = createFileRoute('/_appbase')({
    component: AppBase,
})

function AppBase()
{
    return <div>
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
    </div >
}
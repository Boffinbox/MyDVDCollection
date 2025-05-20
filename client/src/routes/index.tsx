import { CssBaseline, Sheet, Link } from '@mui/joy';
import { createFileRoute, Link as RouterLink } from '@tanstack/react-router'
import collection_large from "/dev/collection_large.jpg"

export const Route = createFileRoute('/')({
    component: Index,
})

function Index()
{
    return <>
        <CssBaseline>
            <Sheet sx={{ backgroundColor: "black", }}>
                <Sheet
                    variant="plain"
                    sx={{
                        backgroundImage: `url(${collection_large})`,
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "cover",
                        height: "100dvh",
                        opacity: "15%"
                        // debug color breakpoints
                        // backgroundColor: { xs: "pink", sm: "lightgreen", md: "lightblue" },
                    }}
                >

                    <Link component={RouterLink} to="/home">
                        Click here to go back to the old homepage
                    </Link>
                </Sheet>
            </Sheet>
        </CssBaseline>
    </>
}

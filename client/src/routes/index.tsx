import { CssBaseline, Sheet, Link, Typography, Box } from '@mui/joy';
import { createFileRoute, Link as RouterLink } from '@tanstack/react-router'
import collection_large from "/dev/collection_large.jpg"
import { useQuery } from '@tanstack/react-query';
import { AccessTokenQueryOptions } from '../utilities/Queries';

export const Route = createFileRoute('/')({
    component: Index,
})

function Index()
{
    const tokenQuery = useQuery(AccessTokenQueryOptions())

    return <>
        <CssBaseline>
            <Sheet
                variant="plain"
                sx={{
                    backgroundImage: `url(${collection_large})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundColor: "black",
                    height: "100dvh",
                    // debug color breakpoints
                    // backgroundColor: { xs: "pink", sm: "lightgreen", md: "lightblue" },
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    px: 2,
                    py: 2,
                }}
            >
                <Typography component="h1"
                    sx={{
                        my: 2,
                        color: "white",
                        fontSize: "5.5em",
                        textAlign: "center"
                    }} >
                    My DVD Collection
                </Typography>
                <Typography level="body-sm"
                    sx={{
                        my: 2,
                        color: "white",
                        fontSize: "1em",
                        textAlign: "center"
                    }}>
                    Welcome to My DVD Collection! Your place for digitally tracking your
                    DVDs, Blu-Rays, CDs, Books, and more!
                </Typography>
                <Box sx={{ my: 2 }}>
                    <Typography
                        sx={{
                            my: 2,
                            fontSize: "1.2em"
                        }}>
                        {tokenQuery.isSuccess ? (
                            <Link component={RouterLink} to="/collections">
                                Click here
                            </Link>
                        ) : (
                            <Link component={RouterLink} to="/login">
                                Click here
                            </Link>
                        )}
                        {` `}
                        <Typography sx={{ color: "white" }}>and get started!</Typography>
                    </Typography>
                </Box>
                {/* <Box sx={{ my: 2 }}>
                    <Typography level="body-sm"
                        sx={{
                            fontSize: "0.8em"
                        }}>
                        <Link component={RouterLink} to="/home">
                            Click here to go back to the old homepage
                        </Link>
                    </Typography>
                </Box> */}
            </Sheet>
        </CssBaseline >
    </>
}

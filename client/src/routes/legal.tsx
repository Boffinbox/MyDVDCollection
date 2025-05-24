import { CssBaseline, Sheet, Link, Typography, Box } from '@mui/joy'
import { createFileRoute, Link as RouterLink } from '@tanstack/react-router'
import collection_large from '/dev/collection_large.jpg'

export const Route = createFileRoute('/legal')({
    component: Legal,
})

function Legal()
{
    return (
        <>
            <CssBaseline>
                <Sheet
                    variant="plain"
                    sx={{
                        backgroundImage: `url(${collection_large})`,
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: 'cover',
                        backgroundColor: 'black',
                        height: '100dvh',
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
                    <Typography
                        level="body-sm"
                        sx={{
                            my: 2,
                            color: 'white',
                            fontSize: '1rem',
                            textAlign: 'center',
                            textShadow: '0.1rem 0.1rem 2rem rgba(255,255,255,0.3)',
                        }}
                    >
                        Legal
                    </Typography>
                    <Typography
                        level="body-sm"
                        sx={{
                            my: 2,
                            color: 'white',
                            fontSize: '1rem',
                            textAlign: 'center',
                            textShadow: '0.1rem 0.1rem 2rem rgba(255,255,255,0.3)',
                        }}
                    >
                        Attributions
                    </Typography>
                    <Box sx={{ my: 2 }}>
                        <Typography level="body-sm"
                            sx={{
                                fontSize: "0.8rem"
                            }}>
                            <Link component={RouterLink} sx={{ color: "rgb(55,150,244)" }} to="https://www.flaticon.com/free-icons/bluray">
                                Bluray icons created by Freepik - Flaticon
                            </Link>
                        </Typography>
                    </Box>
                    <Box sx={{ my: 2 }}>
                        <Typography level="body-sm"
                            sx={{
                                fontSize: "0.8rem"
                            }}>
                            <Link component={RouterLink} sx={{ color: "rgb(55,150,244)" }} to="/">
                                Click here to return to the landing page
                            </Link>
                        </Typography>
                    </Box>
                </Sheet>
            </CssBaseline>
        </>
    )
}

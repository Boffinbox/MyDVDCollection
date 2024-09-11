import { Link as RouterLink } from "@tanstack/react-router"

import { AspectRatio, Button, Card, CardContent, CardOverflow, Link, Sheet, Typography } from "@mui/joy"

export function CollectionCard(
    {
        title = "My Default Collection",
        collId,
        deleteFn
    }: {
        title: string,
        collId: string,
        deleteFn: (...args: any[]) => void,
    })
{
    return (
        <>
            <Card variant="soft" sx={{ mb: 2 }}>
                <CardOverflow>
                    <AspectRatio ratio="4" flex>
                        <img src="/dev/collection.jpg" />
                    </AspectRatio>
                </CardOverflow>
                <CardContent orientation="horizontal">
                    <div>
                        <Typography>
                            <Link
                                component={RouterLink}
                                overlay
                                to="/collections/$collectionId"
                                params={{ collectionId: collId }}
                            >{title}
                            </Link>
                        </Typography>
                        <Typography level="body-sm">
                            Collection info $TODO
                        </Typography>
                    </div>
                    <Button
                        color="danger"
                        size="sm"
                        sx={{ ml: "auto" }}
                        onClick={deleteFn}
                    >
                        Delete...
                    </Button>
                </CardContent>
            </Card>
        </>
    )
}
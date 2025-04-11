import
{
    ListItem,
    ListItemDecorator,
    ListItemContent,
    ListItemButton,
    Typography,
    AspectRatio,
    IconButton,
} from "@mui/joy";

import MoreVertIcon from '@mui/icons-material/MoreVert';

import { Refresh } from "@mui/icons-material";
import { useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { DiscQueryOptions, ReferenceQueryOptions } from "../utilities/Queries";

export function DiscListItem(
    {
        discId,
        collectionId,
        drawerFn,
        updateRefFn
    }: {
        discId: string,
        collectionId: string,
        drawerFn: (...args: any[]) => void
        updateRefFn: (...args: any[]) => void,
    })
{
    const navigate = useNavigate();

    const queryClient = useQueryClient()

    const token: string | undefined = queryClient.getQueryData(["accesstoken"])

    const discQuery = useQuery(DiscQueryOptions(token, collectionId, discId))
    const referenceQuery = useQuery(ReferenceQueryOptions(token, discQuery.data?.referenceDVD))

    if (discQuery.isLoading || referenceQuery.isLoading)
    {
        return (<pre>Disc Loading...</pre>)
    }

    if (discQuery.isError || referenceQuery.isError)
    {
        return (<pre>Disc Error.</pre>)
    }

    return (
        <>
            <ListItem>
                <ListItemButton sx={{ px: 0 }}>
                    <ListItemButton
                        onClick={() => navigate({ to: `/collections/${collectionId}/${discId}` })}
                    >
                        <ListItemDecorator sx={{ mx: "auto" }}>
                            <AspectRatio ratio="135 / 190" flex>
                                <img src={referenceQuery.data.images[0]} />
                            </AspectRatio>
                        </ListItemDecorator>
                        <ListItemContent>
                            <Typography level="title-sm" noWrap>
                                {referenceQuery.data.title}
                            </Typography>
                            <Typography level="body-sm" noWrap>
                                Barcode: {referenceQuery.data.barcode}
                            </Typography>
                        </ListItemContent>
                    </ListItemButton>
                    {referenceQuery.data.upcitemdb_truedata ? <></> :
                        <IconButton onClick={() => updateRefFn(referenceQuery.data.title)}
                            sx={{ backgroundColor: "blue" }}>
                            <Refresh sx={{ color: `#42e308` }} />
                        </IconButton>}
                    <IconButton onClick={drawerFn}>
                        <MoreVertIcon />
                    </IconButton>
                </ListItemButton>
            </ListItem>
        </>
    )
}
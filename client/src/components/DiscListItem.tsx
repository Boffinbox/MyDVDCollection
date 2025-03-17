import
{
    List,
    ListItem,
    ListItemDecorator,
    ListItemContent,
    ListItemButton,
    Drawer,
    Typography,
    AspectRatio,
    IconButton,
    Divider,
    Modal,
    ModalDialog,
    Button,
    Stack,
} from "@mui/joy";

import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';

import { useState } from "react";
import { Edit, InfoOutlined, Refresh } from "@mui/icons-material";
import { SingleLineForm } from "./SingleLineForm";
import { useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { DiscQueryOptions, ReferenceQueryOptions } from "../utilities/Queries";
import { IDisc, IReferenceDisc } from "../Interfaces";
import { PostReference } from "../httpverbs/PostReference";

export function DiscListItem(
    {
        discId,
        collectionId,
        // title = "notitle",
        // barcode = "0000000000000",
        deleteFn,
        drawerFn
        // updateRefFn
    }: {
        discId: string,
        collectionId: string,
        // title: string,
        // barcode: string,
        // trueData: boolean,
        // imageLink: string,
        deleteFn: (...args: any[]) => void,
        drawerFn: (...args: any[]) => void
        // updateRefFn: (...args: any[]) => void,
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
                        // <IconButton onClick={() => updateRefFn("test title")}
                        <IconButton onClick={() => alert("test title")}
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
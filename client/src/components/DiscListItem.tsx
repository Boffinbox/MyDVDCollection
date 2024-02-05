import
{
    ListItem,
    ListItemDecorator,
    ListItemContent,
    Typography,
    AspectRatio,
    IconButton,
    MenuButton,
    Menu,
    MenuItem,
    Dropdown,
    ListItemButton,
} from "@mui/joy";

import { MoreVert } from "@mui/icons-material"

export function DiscListItem(
    {
        title = "notitle",
        barcode = "0000000000000",
        discId,
        deleteFn
    }: {
        title: string,
        barcode: string,
        discId: string,
        deleteFn: (...args: any[]) => void,
    })
{
    return (
        <>
            <ListItem
                sx={{
                    px: "0"
                }}
            >
                <ListItemButton>
                    <ListItemDecorator sx={{ mx: "auto" }}>
                        <AspectRatio ratio="135 / 190" flex>
                            <img src="/dev/dvd.jpg" />
                        </AspectRatio>
                    </ListItemDecorator>
                    <ListItemContent>
                        <Typography level="title-sm">
                            {title}
                        </Typography>
                        <Typography level="body-sm" noWrap>
                            Barcode: {barcode}
                        </Typography>
                    </ListItemContent>
                    <Dropdown>
                        <MenuButton slots={{ root: IconButton }}>
                            <MoreVert />
                        </MenuButton>
                        <Menu>
                            <MenuItem onClick={deleteFn}>Delete</MenuItem>
                        </Menu>
                    </Dropdown>
                </ListItemButton>
            </ListItem>
        </>
    )
}
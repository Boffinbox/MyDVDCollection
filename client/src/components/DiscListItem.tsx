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


export function DiscListItem()
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
                            Disc Title
                        </Typography>
                        <Typography level="body-sm" noWrap>
                            Disc Text Description
                            Disc Text Description
                            Disc Text Description
                            Disc Text Description
                            Disc Text Description
                        </Typography>
                    </ListItemContent>
                    <Dropdown>
                        <MenuButton slots={{ root: IconButton }}>
                            <MoreVert />
                        </MenuButton>
                        <Menu>
                            <MenuItem>Fake Action 1</MenuItem>
                            <MenuItem>Fake Action 2</MenuItem>
                            <MenuItem>Fake Action 3</MenuItem>
                        </Menu>
                    </Dropdown>
                </ListItemButton>
            </ListItem>
        </>
    )
}
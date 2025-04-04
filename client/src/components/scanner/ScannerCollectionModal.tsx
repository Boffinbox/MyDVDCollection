import { Modal, ModalDialog, Typography, List, ListItem, ListItemButton, ListDivider } from "@mui/joy";
import { ICollection } from "../../Interfaces";

export function ScannerCollectionModal(
    {
        isModalOpen,
        closeModal,
        collections,
        setFormData,
        handleCollChange
    }: {
        isModalOpen: boolean
        closeModal: (...args: any[]) => void,
        collections: ICollection[]
        setFormData: (...args: any[]) => void,
        handleCollChange: (collectionId: string) => void
    })
{
    return (
        <>
            <Modal
                open={isModalOpen}
                onClose={closeModal}
                sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            >
                <ModalDialog
                    variant="outlined"
                    sx={{ maxWidth: 500, borderRadius: 'md', p: 3, boxShadow: 'lg' }}
                >
                    <Typography
                        component="h2"
                        level="h4"
                        textColor="inherit"
                        sx={{ fontWeight: 'lg', mb: 1 }}
                    >
                        Pick a collection to scan:
                    </Typography>
                    <List
                        sx={[
                            {
                                mx: 'calc(-1 * var(--ModalDialog-padding))',
                                px: 'var(--ModalDialog-padding)',
                                overflow: 'scroll'
                            }
                        ]}
                    >
                        {collections.map((item, index) => (
                            <ListItem key={index}>
                                <ListItemButton
                                    variant="outlined"
                                    onClick={() =>
                                    {
                                        setFormData(currentData =>
                                        {
                                            return {
                                                ...currentData,
                                                collectionId: item._id.toString()
                                            };
                                        })
                                        handleCollChange(item._id.toString())
                                        closeModal()
                                    }}
                                >
                                    {item.title}
                                </ListItemButton>
                            </ListItem>
                        ))}
                        <ListDivider />
                        <ListItem>
                            <ListItemButton
                                variant="outlined"
                                onClick={() =>
                                {
                                    setFormData(currentData =>
                                    {
                                        return {
                                            ...currentData,
                                            collectionId: ""
                                        };
                                    })
                                    handleCollChange("")
                                    closeModal()
                                }}
                            >
                                Scan all collections
                            </ListItemButton>
                        </ListItem>
                    </List>
                </ModalDialog>
            </Modal>
        </>
    )
}
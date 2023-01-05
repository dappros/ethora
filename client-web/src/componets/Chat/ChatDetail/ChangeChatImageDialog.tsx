import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import {useRef, useState} from "react";
import Box from "@mui/material/Box";
import {CircularProgress} from "@mui/material";
import {uploadFile} from "../../../http";
import xmpp from "../../../xmpp";
import {useStoreState} from "../../../store";
import {useParams} from "react-router";

interface IProps {
    open: boolean;
    onClose: () => void;
    title: string;
    description: string;
    cancelButtonTitle?: string;
}

export function ChangeChatImageDialog({
     open,
     onClose,
     title,
     description,
     cancelButtonTitle,
 }: IProps) {
    const { roomJID } = useParams<{ roomJID: string }>();
    const [modalText, setModalText] = useState("");
    const [loading, setLoading] = useState(false);
    const currentRoom = useStoreState((state) =>
        state.userChatRooms.find((item) => item.jid === roomJID)
    );


    const fileRef = useRef(null);
    const sendFile = (file: File) => {
        setLoading(true);
        setModalText("Loading file, please wait...");

        if(file.type.split("/")[0] === "image"){
            const formData = new FormData();
            formData.append("files", file);

            uploadFile(formData)
                .then((result) => {
                    const roomAddress = roomJID.split("@")[0];

                    xmpp.setRoomImage(
                        roomAddress,
                        result.data.results[0].location,
                        currentRoom.room_background,
                        "icon"
                    );

                    setModalText("Success! The chat icon was set.");
                    setLoading(false)
                })
                .catch((error) => {
                    console.log(error);
                    setModalText("An error occurred while loading the image. "+ " ( "+ error.message+" "+error.response.data+" )");
                    setLoading(false)
                });
        }else{
            setModalText("You can only upload an image, please try again.");
            setLoading(false)
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {description}
                </DialogContentText>
                <input
                    type="file"
                    name="file"
                    id="file"
                    onChange={(event) => sendFile(event.target.files[0])}
                    ref={fileRef}
                    style={{ display: "none" }}
                />
                {loading ?
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <CircularProgress />
                    </Box>
                : null}
                <p>{modalText}</p>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" disabled={loading} onClick={() => fileRef.current.click()} autoFocus >
                    Select and upload
                </Button>
                <Button disabled={loading} onClick={onClose}>
                    {cancelButtonTitle || "Cancel"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

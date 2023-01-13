import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import {useState} from "react";
import xmpp from "../../xmpp";
import { AudioRecorder, useAudioRecorder } from 'react-audio-voice-recorder';
import {uploadFile} from "../../http";
import {TProfile} from "../../pages/Profile/types";
import {useStoreState} from "../../store";
import {Box, CircularProgress} from "@mui/material";

interface IProps {
    profile: TProfile;
    currentRoom: string;
    roomData: any
}

export function ChatAudioMessageDialog({
   profile,
   currentRoom,
   roomData
}: IProps) {
    const user = useStoreState((store) => store.user);
    const [loading, setLoading] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const recorderControls = useAudioRecorder();
    const [statusSend, setStatusSend] = useState(true);
    const [showAudioMsgDialog, setShowAudioMsgDialog] = useState(false);


    const addAudioElement = (blob) => {
        if(statusSend){
            setShowAudioMsgDialog(true)
            setLoading(true)
            let formData = new FormData();
            formData.append('files', blob);

            uploadFile(formData)
                .then((result) => {
                    let userAvatar = "";
                    if (profile?.profileImage) {
                        userAvatar = profile?.profileImage;
                    }

                    result.data.results.map(async (item: any) => {
                        const data = {
                            firstName: user.firstName,
                            lastName: user.lastName,
                            walletAddress: user.walletAddress,
                            chatName: roomData.name,
                            userAvatar: userAvatar,
                            createdAt: item.createdAt,
                            expiresAt: item.expiresAt,
                            fileName: item.filename,
                            isVisible: item.isVisible,
                            location: item.location,
                            locationPreview: item.locationPreview,
                            mimetype: item.mimetype,
                            originalName: item.originalname,
                            ownerKey: item.ownerKey,
                            size: item.size,
                            duration: item?.duration,
                            updatedAt: item.updatedAt,
                            userId: item.userId,
                            waveForm: "",
                            attachmentId: item._id,
                            wrappable: true,
                        };
                        xmpp.sendMediaMessageStanza(currentRoom, data);
                        closeDialog()
                    });
                    setLoading(false)
                    setShowAudioMsgDialog(false)
                }).catch((error) => {
                console.log(error);
                setAlertMessage("An error occurred while loading your audio.")
            });
        }
    };

    const closeDialog = () => {
        setStatusSend(false);
        setShowAudioMsgDialog(false);
    }

    return (
        <div>
            <AudioRecorder recorderControls={recorderControls} onRecordingComplete={blob => {
                addAudioElement(blob)
            }} />
            <Dialog
                open={showAudioMsgDialog}
                onClose={() => setShowAudioMsgDialog(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Sending audio...</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {loading ?
                            <Box sx={{ display: "flex", justifyContent: "center" }}>
                                <CircularProgress />
                            </Box>
                            :null
                        }
                        <Box sx={{ display: "flex", justifyContent: "center" }}>
                            {alertMessage.length === 0 && !loading ?
                                alertMessage
                                :null
                            }
                        </Box>
                    </DialogContentText>
                </DialogContent>
            </Dialog>
        </div>
    );
}

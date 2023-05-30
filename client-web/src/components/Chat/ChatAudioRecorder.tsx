import React, { useCallback, useState } from "react";
import xmpp from "../../xmpp";
import { AudioRecorder, useAudioRecorder } from "react-audio-voice-recorder";
import { uploadFile } from "../../http";
import { TProfile } from "../../pages/Profile/types";
import { useStoreState } from "../../store";
import { Box, CircularProgress } from "@mui/material";
import { useSnackbar } from "../../context/SnackbarContext";

interface IProps {
  profile: TProfile;
  currentRoom: string;
  roomData: any;
}

export function ChatAudioMessageDialog({
  profile,
  currentRoom,
  roomData,
}: IProps) {
  const user = useStoreState((store) => store.user);
  const [loading, setLoading] = useState(false);
  const recorderControls = useAudioRecorder();
  const { showSnackbar } = useSnackbar();
  const addAudioElement = (blob: Blob) => {
    setLoading(true);
    let formData = new FormData();
    formData.append("files", blob);
    uploadFile(formData)
      .then((result) => {
        let userAvatar = "";
        if (profile?.profileImage) {
          userAvatar = profile?.profileImage;
        }

        result.data.results.map(async (item: any) => {
          
          let data = {
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
            roomJid: currentRoom
          };
          xmpp.sendMediaMessageStanza(currentRoom, data);
        });
      })
      .catch((error) => {
        console.log(error);
        showSnackbar("error", "An error occurred while loading your audio.");
      });
    setLoading(false);

  };

  return (
    <Box>
      <Box style={{ display: loading ? "none" : "block" }}>
        <AudioRecorder
          recorderControls={recorderControls}
          onRecordingComplete={addAudioElement}
        />
      </Box>
      {loading && <CircularProgress color={"secondary"} size={"20px"} />}
    </Box>
  );
}

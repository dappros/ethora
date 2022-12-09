import React, { useState } from "react";
import { Avatar, Box, Button, Container, IconButton, Modal, TextField, Typography } from "@mui/material";
import { useParams } from "react-router";
import { useStoreState } from "../../store";
import xmpp from "../../xmpp";
import EditIcon from "@mui/icons-material/Edit";

export default function ChatDetailCard (){
    const {roomJID}:any = useParams()
    const [newDescription, setNewDescription] = useState<string>("");
    const [showModal, setShowModal] = useState<boolean>(false);
    const currentRoomData = useStoreState((store) => store.userChatRooms).filter((e) => e.jid === roomJID)[0];
    const handleChangeDescription = (newDescription:string) => {
        xmpp.changeRoomDescription(
            roomJID,
            newDescription
        )
      }
    return(
        <Container style={{justifyContent:"center", alignItems:"center", display:"flex", flexDirection:"column"}}>
            <Box
            sx={{
            width: 300,
            height: 300,
            margin:5,
            backgroundColor: 'primary.dark',
            justifyContent:"center",
            alignItems:"center",
            display:"flex"
            }}
        >
            {currentRoomData?.room_thumbnail&&currentRoomData?.room_thumbnail!=='none'?
            <Avatar
            sx={{
                width: 300,
                height: 300,
            }}
            variant="square"
            src={currentRoomData.room_thumbnail}
            />:
            <Typography
            color={"white"}
            fontSize={'120px'}
            >
                {currentRoomData?.name[0]}
            </Typography>
            }
        </Box>
        <Typography
        fontSize={"20px"}
        fontWeight={"bold"}
        >
            {currentRoomData?.name}
        </Typography>
        <Container style={{flexDirection:"row", justifyContent:"center", alignItems:"center", display:"flex"}}>
            <Typography fontSize={"20px"}>
                {currentRoomData?.description?currentRoomData.description:"No description set"}
            </Typography>
            <IconButton 
            onClick={()=>setShowModal(true)}
            style={{
                marginLeft:10
            }}>
                <EditIcon 
                fontSize="small"/>
            </IconButton>
        </Container>
        <Modal
        open={showModal}
        onClose={setShowModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        >
        <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
            Set new description
            </Typography>
            <TextField
            onChange={(e) => setNewDescription(e.target.value)}
            margin="normal"
            id="outlined-basic"
            label="Description" 
            variant="outlined"/>
            <Button
            onClick={()=>{
                setShowModal(false);
                handleChangeDescription(newDescription)
            }}
            style={{
                justifyContent:"center",
                alignItems:"center",
                display:"flex"
            }}
             variant="outlined">
            <Typography id="modal-modal-description" >
                Submit
            </Typography>
            </Button>
        </Box>
        </Modal>
      </Container>
    )
}

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    justifyContent: "center",
    flex:"display"
};
import React, {useEffect, useState} from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import xmpp from "../../xmpp";
import {useStoreState} from "../../store";
import {Stack, Typography} from "@mui/material";
import {getBalance, getPublicProfile, getTransactions} from "../../http";
import {TProfile} from "../Profile/types";
import Avatar from "@mui/material/Avatar";

export function ChatInRoom() {
    const [room, setRoom] = useState("");
    const messages = useStoreState((state) => state.historyMessages);
    const user = useStoreState((store) => store.user);
    const [profile, setProfile] = useState<TProfile>();
    const [myMessage, setMyMessage] = useState('');
    const [currentRoom, setCurrentRoom] = useState("");
    const [defaultAvatar, setDefaultAvatar] = useState("https://cdn-icons-png.flaticon.com/512/2102/2102647.png")

    useEffect(() => {
        getPublicProfile(user.walletAddress)
            .then((result) => {
                setProfile(result.data.result);
            })
    }, []);

    const onSubscribe = () => {
        const newCurrentRoom = room+'@conference.dev.dxmpp.com';
        setCurrentRoom(newCurrentRoom);

        if(messages.length > 0){
            // getMoreMessages();
            console.log('delete', messages)
            useStoreState.getState().clearMessageHistory()
            return
        }

        xmpp.presenceInRoom(newCurrentRoom);
        xmpp.getRoomArchiveStanza(newCurrentRoom);
        console.log(messages)
    };

    const getMoreMessages = () => {
        // @ts-ignore
        xmpp.getPaginatedArchive(currentRoom, messages[0].id);
    };

    const testData = () => {
      xmpp.test()
        console.log(messages)
    }

    const sendMessage = () => {
        let userAvatar = defaultAvatar;
        if(profile?.profileImage){
            userAvatar = profile?.profileImage;
        }
        xmpp.sendMessage(currentRoom, user.firstName, user.lastName, userAvatar, user.walletAddress, myMessage)
    };

    return (
        <Box>
            <Box>ChatInRoom</Box>
            <Box>My jid: {xmpp.client.jid?.toString()}</Box>
            <Box>
                <TextField
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                ></TextField>
                <Button onClick={onSubscribe}>Subscribe</Button>
            </Box>
            <Button onClick={getMoreMessages}>Get more</Button>
            <Button onClick={testData}>testData</Button>

            <Box sx={{p: 2, border: '1px dashed grey'}}>
                <Box>Chat window</Box>
                <Stack spacing={2}>
                    {
                        messages.filter((item: any) => item.roomJID === currentRoom).map(message => <Box key={message.id} sx={{
                        border: '1px solid grey',
                        borderRadius: 1
                        }}>
                        <Typography variant="body2" gutterBottom>
                            <Avatar alt="Remy Sharp" src={message.data.photoURL ? message.data.photoURL : defaultAvatar} />
                            {message.data.senderFirstName} {message.data.senderLastName} : {message.body}</Typography></Box>)
                    }
                    <Box
                        component="form"
                        noValidate
                        autoComplete="off"
                    >
                        <TextField
                            fullWidth
                            id="outlined-multiline-flexible"
                            label="Write to chat"
                            multiline
                            maxRows={4}
                            value={myMessage}
                            onChange={(e) => setMyMessage(e.target.value)}
                        />
                        <Button onClick={sendMessage} variant="outlined">Send</Button>
                    </Box>
                </Stack>
            </Box>
        </Box>
    );
}

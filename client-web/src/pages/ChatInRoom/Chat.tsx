import React, {useState} from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import xmpp from "../../xmpp";
import {useStoreState} from "../../store";
import {Stack, Typography} from "@mui/material";

export function ChatInRoom() {
    const [room, setRoom] = useState("");
    const messages = useStoreState((state) => state.messages);
    const [myMessage, setMyMessage] = useState('');
    const [currentRoom, setCurrentRoom] = useState("");

    const onSubscribe = () => {
        xmpp.presenceInRoom(room);
        setCurrentRoom(room);
    };

    const sendMessage = () => {
        xmpp.sendMessage(currentRoom, 'Test', 'User', myMessage)
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

            <Box>
                <TextField
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                ></TextField>
                <Button onClick={() => xmpp.unsubscribe(room)}>unsubscribe</Button>
            </Box>

            <Box sx={{p: 2, border: '1px dashed grey'}}>
                <Box>Chat window</Box>
                <Stack spacing={2}>
                    {messages.map(message => <Box key={message.body} sx={{
                        border: '1px solid grey',
                        borderRadius: 1
                    }}><Typography variant="body2"
                                   gutterBottom> {message.firsName} {message.lastName} : {message.body}</Typography></Box>)}
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

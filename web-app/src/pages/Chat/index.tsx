import * as React from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import {useState} from '../../store'
import {useHistory} from 'react-router-dom'
import ChatDebug from "./ChatDebug";

export default function Chat() {
  const user = useState((state) => state.user)
  const messages = useState((state) => state.messages)
  const history = useHistory()

  React.useEffect(() => {
    if (!user.firstName) {
      history.push('/')
    }
  }, [user.firstName, history])
  return (
    <Container maxWidth="xl" style={{height: 'calc(100vh - 68px)'}}>
      <Box>Chat</Box>
      <Box>{messages.length}</Box>
      <ChatDebug></ChatDebug>
    </Container>
  );
}

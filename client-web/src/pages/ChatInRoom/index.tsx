import React, { useEffect } from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { useStoreState } from "../../store";
import { useHistory } from "react-router-dom";
import { ChatInRoom } from "./Chat";

export default function Chat() {
  const user = useStoreState((state) => state.user);
  const messages = useStoreState((state) => state.messages);
  const history = useHistory();

  useEffect(() => {
    if (!user.firstName) {
      history.push("/");
    }
  }, [user.firstName, history]);
  return (
    <Container maxWidth="xl" style={{ height: "calc(100vh - 68px)" }}>
      <Box>Chat</Box>
      <Box>{messages.length}</Box>
      <ChatInRoom />
    </Container>
  );
}

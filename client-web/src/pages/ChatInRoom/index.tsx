import React, { useEffect } from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { useStoreState } from "../../store";
import { ChatInRoom } from "./Chat";

export default function Chat() {
  const messages = useStoreState((state) => state.messages);

  return (
    <Container maxWidth="xl" style={{ height: "calc(100vh - 68px)" }}>
      <Box>Chat</Box>
      <Box>{messages.length}</Box>
      <ChatInRoom />
    </Container>
  );
}

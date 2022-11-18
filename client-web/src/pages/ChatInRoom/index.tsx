import React, { useEffect } from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { useStoreState } from "../../store";
import { ChatInRoom } from "./Chat";
import xmpp from "../../xmpp";

export default function Chat() {
  const messages = useStoreState((state) => state.messages);
  const user = useStoreState((state) => state.user);

  useEffect(() => {
    xmpp.init(user.walletAddress, user?.xmppPassword as string);
  }, []);

  return (
    <Container maxWidth="xl" style={{ height: "calc(100vh - 68px)" }}>
      <Box>Chat</Box>
      <Box>{messages.length}</Box>
      <ChatInRoom />
    </Container>
  );
}

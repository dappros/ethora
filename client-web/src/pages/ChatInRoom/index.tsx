import React from "react"
import Container from "@mui/material/Container"
import { ChatInRoom } from "./Chat"

export default function Chat() {
  return (
    <Container maxWidth="xl" style={{ height: "calc(100vh - 68px)" }}>
      <ChatInRoom />
    </Container>
  )
}

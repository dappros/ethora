import React, { useEffect } from "react";
import { Container } from "@mui/material";
import ChatDetailCard from "./ChatDetailCard";
import MembersList from "./MembersList";
import xmpp from "../../xmpp";
import { useParams } from "react-router";

export default function ChatRoomDetails(){
    const {roomJID}:any = useParams();
    useEffect(()=>{
        xmpp.getRoomMemberInfo(roomJID)
        xmpp.getRoomInfo(roomJID);
    },[])
    return(
        <Container maxWidth="xl">
            <ChatDetailCard/>
            <MembersList />
        </Container>
    )
}
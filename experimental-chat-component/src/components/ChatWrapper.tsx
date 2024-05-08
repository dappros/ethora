import React, { FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { setUser } from "../store/chatSettingsSlice";
import ChatRoom from "./ChatRoom.1";
import xmppClient from "../networking/xmppClient";

interface ChatWrapperProps {}

const ChatWrapper: FC<ChatWrapperProps> = ({}) => {
  const { user } = useSelector((state: RootState) => state.chatSettingStore);
  const client = xmppClient;
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("Initting user");
    if (!user) {
      const defaultUser = {
        _id: "65495bdae5b326bb1b2d33e7",
        walletAddress: "0x6C394B10F5Da4141b99DB2Ad424C5688c3f202B3",
        xmppPassword: "Q9MIMMhZVe",

        firstName: "Roman",
        lastName: "Leshchukh",
      };
      dispatch(setUser(defaultUser));
    }
    console.log("Initting client");

    client.init(user.walletAddress, user.xmppPassword);
  }, []);

  return <ChatRoom />;
};

export { ChatWrapper };

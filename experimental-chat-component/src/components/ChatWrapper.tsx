import React, { FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { setUser } from "../store/chatSettingsSlice";
import ChatRoom from "./ChatRoom";
import xmppClient from "../networking/xmppClient";

interface ChatWrapperProps {}

const ChatWrapper: FC<ChatWrapperProps> = ({}) => {
  const { user } = useSelector((state: RootState) => state.chatSettingStore);
  const client = xmppClient;
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user) {
      const defaultUser = {
        _id: "65831a646edcd3cee0545757",
        walletAddress: "0x6816810a7Fe04FC9b800f9D11564C0e4aEC25D78",
        xmppPassword: "HDC7qnWI16",

        firstName: "Yuki",
        lastName: "R",
      };
      dispatch(setUser(defaultUser));
    }
    client.init(user.walletAddress, user.xmppPassword);
  }, []);

  return <ChatRoom />;
};

export { ChatWrapper };

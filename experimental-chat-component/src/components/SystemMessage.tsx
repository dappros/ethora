import React from "react";
import {
  CustomSystemMessage,
  CustomSystemMessageText,
} from "./styled/StyledComponents";

interface SystemMessageProps {
  messageText: string;
}

const SystemMessage: React.FC<SystemMessageProps> = ({ messageText }) => {
  return (
    <CustomSystemMessage>
      <CustomSystemMessageText>{messageText}</CustomSystemMessageText>
    </CustomSystemMessage>
  );
};

export default SystemMessage;
